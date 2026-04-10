const express = require('express');
const path = require('path');
const os = require('os');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3500;

// --- MiddLeware ---
app.use(express.json());

const frontendPath = path.join(__dirname, '..', 'Frontend');
app.use(express.static(frontendPath));

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

// --- ROUTES ---
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Contact form handling (POST request)
app.post('/contact', async (req, res) => { 
    const { name, email, phone, subject, message } = req.body; 

    console.log(`📩 New message received: ${name} (${email})`); 

    // --- NODMAILER CONFIGURATION --- 
    // WARNING: Enter your own details here! 
    const transporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: 'SAJAT_GMAIL_CIMED@gmail.com', 
            pass: 'GO_TO_THE_APPLICATION_PASSWORD' 
        } 
    }); 

    const mailOptions = { 
        from: email, 
        to: 'SAJAT_GMAIL_CIMED@gmail.com', 
        subject: `Game Room Support: ${subject}`, 
        text: `From: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    };
    try {
        // If you don't want to send it live yet, comment this part out
        // await transporter.sendMail(mailOptions);
        console.log("✅ Email successfully logged/sent!");
        res.status(200).json({ success: true, message: "Message sent!" });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ success: false, message: "Error sending." });
    }
});

// --- Server Starter ---
const IP_ADDRESS = getLocalIP();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GAME SERVER ONLINE`);
    console.log(`🏠 Local:   http://localhost:${PORT}`);
    console.log(`🌐 Network: http://${IP_ADDRESS}:${PORT}`);
    console.log(`📂 Mappa:   ${frontendPath}`);
});