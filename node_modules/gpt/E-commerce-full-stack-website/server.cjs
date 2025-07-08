require('dotenv').config();
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const nodemailer = require('nodemailer');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");

const app = express();
console.log("Server is running from:", __dirname);

// Env variables
const {
  DB_HOST = "localhost",
  DB_USER = "root",
  DB_PASSWORD = "@Ayan2004",
  DB_NAME = "user_auth",
  SESSION_SECRET = "secretKey",
  EMAIL_USER = "dragonballzhype@gmail.com",
  EMAIL_PASS = "zekl yqov ezpz kccv",
  PORT = 3000
} = process.env;

// DB connection
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL connected!");
    conn.release();
  })
  .catch(err => {
    console.error("❌ MySQL connection failed:", err.message);
  });

const sessionStore = new MySQLStore({}, pool);

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "views", "dist"))); // Serve static files from Vite build

// Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Sessions
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: false }
}));

// Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// ==== ROUTES ====
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length > 0) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error creating user" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.user = {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie('connect.sid');
    res.json({ message: "Logged out successfully" });
  });
});

// OTP Password Reset
const otpStore = new Map();

app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) return res.status(404).json({ message: "Email not found" });

    otpStore.set(email, { otp, expires: Date.now() + 600000 }); // 10 min

    await transporter.sendMail({
      from: `E-Commerce App <${EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `<h2>Password Reset</h2><p>Your OTP: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedOtp = otpStore.get(email);

    if (!storedOtp || storedOtp.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > storedOtp.expires) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    otpStore.delete(email);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
});

// Checkout
app.post("/api/checkout", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Unauthorized" });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, email, address, city, zip, country, products } = req.body;

    const [cartResult] = await connection.execute(
      `INSERT INTO cart (user_id, name, email, address, city, zip, country) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.session.user.id, name, email, address, city, zip, country]
    );

    if (Array.isArray(products) && products.length > 0) {
      const values = products.map(p => [cartResult.insertId, p.name, p.quantity, p.price]);
      await connection.query(
        `INSERT INTO cart_products 
         (cart_id, product_name, quantity, price) 
         VALUES ?`,
        [values]
      );
    }

    await connection.commit();
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    await connection.rollback();
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Checkout failed" });
  } finally {
    connection.release();
  }
});


// Session status
app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
})

// SPA fallback (Vite built frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dist", "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
