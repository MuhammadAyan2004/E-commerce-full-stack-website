document.getElementById('request-otp-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;

  try {
    const res = await fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      // Store email temporarily and redirect to reset page
      localStorage.setItem('resetEmail', email);
      window.location.href = 'reset.html';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong!');
  }
});
