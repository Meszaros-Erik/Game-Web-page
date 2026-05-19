const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// --- Registration ---
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: "You have already registered with this email address!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 2)`;
        await pool.query(sql, [username, email, hashedPassword]);

        res.status(201).json({ success: true, message: "Successful registration! You can now log in." });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
});

// --- Login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password!" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password!" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Successful login!",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});

module.exports = router;