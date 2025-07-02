

document.addEventListener('DOMContentLoaded', () => {

  (async () => {
    try {
      const res = await fetch('/api/all-filenames');
      existingFilenames = await res.json();
    } catch (err) {
      console.error('Failed to load filenames:', err);
    }
  })();

  const form = document.querySelector('form');
  const mediaType = document.getElementById('mediaType');
  const mediaFile = document.getElementById('mediaFile');

  const allowedExtensions = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    sound: ['.mp3', '.wav', '.ogg'],
    video: ['.mp4', '.webm', '.avi', '.mov']
  };

  const acceptMap = {
    image: 'image/*',
    sound: 'audio/*',
    video: 'video/*'
  };

  // changing filetype 
  mediaType.addEventListener('change', () => {
    mediaFile.accept = acceptMap[mediaType.value] || '';
    mediaFile.value = ''; // reset file input
  });

  // uploading the file
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let existingFilenames = {};
    const nameInput = mediaName.value.trim();
    const name = nameInput || file.name.substring(0, file.name.lastIndexOf('.'));
    const fullName = name + extension;
    const file = mediaFile.files[0];

    const taken = existingFilenames[type + 's'] || [];
    if (taken.includes(fullName)) {
      showMessage(`A ${type} with the name "${fullName}" already exists. Please choose a different name.`, true);
      return;
    }

    if (!file) return;

    const type = mediaType.value;
    const validExtensions = allowedExtensions[type];
    const extension = file.name.toLowerCase().match(/\.[0-9a-z]+$/)?.[0];

    if (!extension || !validExtensions.includes(extension)) {
      showMessage(`Invalid file type. Please upload one of: ${validExtensions.join(', ')}`, true);
      return;
    }

    try {
      const formData = new FormData(form);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const text = await response.text();
      showMessage(text);  // Success
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
      message.addEventListener('click', () => message.remove());
      form.after(message);
    }

    message.innerText = text;
    message.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    message.style.color = isError ? '#721c24' : '#155724';
    message.style.border = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
  }
});
