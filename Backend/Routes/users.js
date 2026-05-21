const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, role FROM users');
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

router.put('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { username, oldPassword, newPassword, profile_picture } = req.body;
    
    try {
        const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
        if (users.length === 0) return res.status(404).json({ success: false, message: "User not found !" });
        
        const user = users[0];
        let updateQuery = "UPDATE users SET username = ?, profile_picture = ?";
        let params = [username, profile_picture];

        if (newPassword && oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(401).json({ success: false, message: "Invalid old password !" });
            
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateQuery += ", password = ?";
            params.push(hashedPassword);
        }
        
        updateQuery += " WHERE id = ?";
        params.push(id);

        await pool.query(updateQuery, params);
        res.status(200).json({ success: true, message: "Profile updated!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;