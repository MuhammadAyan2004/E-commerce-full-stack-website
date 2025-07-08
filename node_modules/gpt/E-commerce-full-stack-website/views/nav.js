window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");
  const logoutBtn = document.getElementById("logoutBtn");

  fetch("http://localhost:3000/api/session", {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        if (header) header.style.display = "none";
        if (nav) nav.style.marginTop = "0px";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
      }
    });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === "Logged out successfully") {
            // Restore header and hide logout button
            if (header) header.style.display = "flex";
            if (logoutBtn) logoutBtn.style.display = "none";
            window.location.href = "/index.html"
          }
        })
        .catch(err => {
          console.error("Logout failed:", err);
        });
    });
  }
});
