const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const frontendPath = path.join(__dirname, '..', 'Frontend');

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`The server is running on: http://localhost:${PORT}`);
    console.log(`Requested folder: ${frontendPath}`);
    console.log(`=========================================`);
});