document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // prevent default full-page form submission

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const text = await response.text();

      alert(text); // Show success message
      form.reset(); // Clear the form
    } catch (error) {
      alert('Upload failed.');
      console.error('Upload error:', error);
    }
  });
});
