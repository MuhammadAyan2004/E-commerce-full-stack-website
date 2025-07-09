import { cartvalue } from "./cartvalue";
import { fetchquantityfromLs } from "./fetchquantityfromLs";

document.addEventListener('DOMContentLoaded', () => {
  const cartForm = document.getElementById('cart-form');

  cartForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      zip: document.getElementById('zip').value,
      country: document.getElementById('country').value,
      products: cartvalue()
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Order placed successfully!');
        window.location.href = '/index.html';
      } else {
        alert(data.message || 'Order placement failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  });
});
