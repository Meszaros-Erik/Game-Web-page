const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3500;

// --- MiddLeware ---
app.use(express.json());

const frontendPath = path.join(__dirname, '..', 'Frontend');
app.use(express.static(frontendPath));

// --- IP Address retrieval ---
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

// --- Import Routes ---
const usersRoutes = require('./routes/users');
const gamesRoutes = require('./routes/games');
const scoresRoutes = require('./routes/scores');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Connecting endpoints to files
app.use('/api/users', usersRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// --- Server Starter ---
const IP_ADDRESS = getLocalIP();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Game Server Online!`);
    console.log(`🏠 Local :   http://localhost:${PORT}`);
    console.log(`🌐 Network : http://${IP_ADDRESS}:${PORT}`);
    console.log(`📂 Folder :  ${frontendPath}`);
});