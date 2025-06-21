document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('mediaDisplay');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  window.fetchMedia = function (type) {
    fetch(`/api/${type}`)
      .then(res => res.json())
      .then(files => {
        display.innerHTML = '';

        if (!files.length) {
          display.innerHTML = `<p>No ${type} found.</p>`;
          return;
        }

        files.forEach(file => {
          const fileUrl = `/media/${type}/${file}`;
          let element;

          if (type === 'images') {
            element = document.createElement('img');
            element.src = fileUrl;
            element.alt = file;
            element.style.width = '150px';
            element.style.height = '150px';
            element.style.objectFit = 'cover';
            element.style.cursor = 'pointer';

            element.addEventListener('click', () => {
              lightboxImg.src = fileUrl;
              lightbox.classList.remove('hidden');
            });
          }

          else if (type === 'videos') {
            element = document.createElement('video');
            element.src = fileUrl;
            element.controls = true;
            element.style.width = '100%';           // Stretch to fill grid cell
            element.style.height = 'auto';          // Maintain aspect ratio
            element.style.display = 'block';        // Ensure no inline weirdness
            element.style.objectFit = 'cover';      // Optional: avoid distortion
          }

          else if (type === 'sounds') {
            element = document.createElement('audio');
            element.src = fileUrl;
            element.controls = true;
            element.style.display = 'block';
            element.style.margin = '10px 0';
          }

          display.appendChild(element);
        });
      })
      .catch(err => {
        console.error('Error fetching media:', err);
        display.innerText = 'Error loading media.';
      });
  };

  closeBtn.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
      lightboxImg.src = '';
    }
  });
});
