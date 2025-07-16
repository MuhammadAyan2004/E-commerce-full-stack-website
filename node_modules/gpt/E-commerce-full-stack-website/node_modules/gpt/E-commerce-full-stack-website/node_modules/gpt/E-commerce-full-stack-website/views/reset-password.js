document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = localStorage.getItem('resetEmail');
  const otp = document.getElementById('otp').value;
  const newPassword = document.getElementById('newPassword').value;

  try {
    const res = await fetch('/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      localStorage.removeItem('resetEmail');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Reset failed!');
  }
});
