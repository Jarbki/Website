const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Default route: serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// show stored sounds
app.get("/view", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/view.html'));
});


app.get("/upload", (req, res) =>{
    res.sendFile(path.join(__dirname, '../frontend/upload.html'));
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});