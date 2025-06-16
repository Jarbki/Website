const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Default route: serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// the view page
app.get("/view", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/view/view.html'));
});

// the upload page
app.get("/upload", (req, res) =>{
    res.sendFile(path.join(__dirname, '../frontend/upload/upload.html'));
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// image request handling
app.get('/api/images', (req, res) => {
  const fs = require('fs');
  const dirPath = path.join(__dirname, '../media/images');
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read images.' });
    res.json(files);
  });
});

// video request handling
app.get('/api/videos', (req, res) => {
  const fs = require('fs');
  const dirPath = path.join(__dirname, '../media/videos');
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read videos.' });
    res.json(files);
  });
});

// sound request handling
app.get('/api/sounds', (req, res) => {
  const fs = require('fs');
  const dirPath = path.join(__dirname, '../media/sounds');
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read sounds.' });
    res.json(files);
  });
});



// Custom storage to decide destination dynamically
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const mediaType = req.body.mediaType;
    let folder;

    switch (mediaType) {
      case 'image':
        folder = '../media/images';
        break;
      case 'sound':
        folder = '../media/sounds';
        break;
      case 'video':
        folder = '../media/videos';
        break;
      default:
        return cb(new Error('Invalid media type'), null);
    }

    const fullPath = path.join(__dirname, folder);

    // Create folder if it doesn't exist
    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    const originalExt = path.extname(file.originalname);
    const name = req.body.mediaName || path.basename(file.originalname, originalExt);
    cb(null, name + originalExt);
  }
});
const upload = multer({ storage: storage });