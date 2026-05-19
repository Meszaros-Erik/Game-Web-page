const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Error retrieving messages:", error);
        res.status(500).json({ success: false, message: "Server error while retrieving messages." });
    }
});

router.post('/', async (req, res) => { 
    const { name, email, phone, subject, message } = req.body; 
    console.log(`📩 New message received: ${name} (${email})`); 

    try {
        const sql = `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`;
        const values = [name, email, phone, subject, message];
        const [result] = await pool.query(sql, values);
        
        console.log("✅ New message successfully saved to the database! ID:", result.insertId);
        res.status(200).json({ success: true, message: "Message saved!" });
    } catch (error) {
        console.error("❌ Error occurred while saving to the database:", error);
        res.status(500).json({ success: false, message: "Server error occurred while saving the message." });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: "Message successfully deleted!" });
    } catch (error) {
        console.error("❌ Error occurred while deleting the message:", error);
        res.status(500).json({ success: false, message: "Server error occurred while deleting the message." });
    }
});

module.exports = router;