document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // stop default form behavior

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const text = await response.text();

      // Show success message
      showMessage(text);

      // Clear the form
      form.reset();
    } catch (error) {
      showMessage('Upload failed. Please try again.', true);
      console.error('Upload error:', error);
    }
  });

  function showMessage(text, isError = false) {
    let message = document.getElementById('uploadMessage');

    if (!message) {
      message = document.createElement('div');
      message.id = 'uploadMessage';
      message.style.marginTop = '1rem';
      message.style.padding = '0.75rem';
      message.style.borderRadius = '5px';
      message.style.cursor = 'pointer';
      message.style.fontWeight = 'bold';
      message.addEventListener('click', () => {
        message.remove(); // remove on click
      });
      form.after(message);
    }

    message.innerText = text;
    message.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    message.style.color = isError ? '#721c24' : '#155724';
    message.style.border = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
  }
});
