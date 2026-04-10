const express = require('express');
const path = require('path');
const os = require('os');
const app = express();
const PORT = 3500;

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let name in interfaces) {
        for (let iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const frontendPath = path.join(__dirname, '..', 'Frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const IP_ADDRESS = getLocalIP();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 The Game Server is Running!`);
    console.log(`🏠 Local Access: http://localhost:${PORT}`);
    console.log(`🌐 Other Devices Can Access: http://${IP_ADDRESS}:${PORT}`);
});