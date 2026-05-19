const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, role FROM users');
        console.log("Users coming from the database:", rows);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving users." });
    }
});

router.put('/:id', async (req, res) => {
    const { role } = req.body;
    try {
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.status(200).json({ success: true, message: "Role updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating role." });
    }
});

module.exports = router;