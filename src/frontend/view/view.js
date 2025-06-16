    function fetchMedia(type) {
      fetch(`/api/${type}`)
        .then(res => res.json())
        .then(files => {
          const display = document.getElementById('mediaDisplay');
          display.innerHTML = ''; // Clear existing content

          if (!files.length) {
            display.innerHTML = `<p>No ${type} found.</p>`;
            return;
          }

          files.forEach(file => {
            let element;
            const fileUrl = `/media/${type}/${file}`;

            if (type === 'images') {
              element = document.createElement('img');
              element.src = fileUrl;
              element.alt = file;
              element.style.maxWidth = '300px';
              element.style.margin = '10px';
            } else if (type === 'videos') {
              element = document.createElement('video');
              element.src = fileUrl;
              element.controls = true;
              element.style.maxWidth = '400px';
              element.style.margin = '10px';
            } else if (type === 'sounds') {
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
          document.getElementById('mediaDisplay').innerText = 'Error loading media.';
        });
    }