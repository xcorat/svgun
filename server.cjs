const Gun = require('gun');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8765;

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static('public'));

// Create server
const server = app.listen(port);

// Create a Gun instance
const gun = Gun({
    web: server,
    file: 'radata', // Use radata directory for storage
    multicast: false, // Disable multicast for local development
    axe: false, // Disable axe for local development
    radisk: true, // Enable radisk storage
});

// Handle Gun requests
app.get('/gun', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(gun.back('opt.web')._.opt.file || '');
    console.log(gun.back('opt.web')._.opt.file);
});

app.post('/gun', (req, res) => {
    res.set('Content-Type', 'text/plain');
    gun.on('out', { '@': req.body['#'] });
    res.send('OK');
    console.log(req.body);
});

console.log(`Gun server started on port ${port}`);
