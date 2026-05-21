const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM scores ORDER BY score DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error while retrieving scores." });
    }
});

router.post('/', async (req, res) => {
    console.log("\nIncoming data:", req.body);
    const { user_id, username, game_title, score, level, duration } = req.body;
    const finalDuration = (duration && duration !== "undefined" && duration !== "-") ? duration : "0:00";
    const finalLevel = level || '-';
    try {
        const sql = `INSERT INTO scores (user_id, username, game_title, score, level, duration) VALUES (?, ?, ?, ?, ?, ?)`;
        await pool.query(sql, [user_id, username, game_title, score, finalLevel, finalDuration]);
        res.status(201).json({ success: true, message: "Score added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Database error" });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, username, game_title, score, level, duration } = req.body;
    try {
        const sql = `UPDATE scores SET user_id = ?, username = ?, game_title = ?, score = ?, level = ?, duration = ? WHERE id = ?`;
        await pool.query(sql, [user_id, username, game_title, score, level, duration, id]);
        res.status(200).json({ success: true, message: "Score updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error while updating the score." });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM scores WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: "Score deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error while deleting the score." });
    }
});

router.get('/:user_id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM scores WHERE user_id = ? ORDER BY score DESC', [req.params.user_id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred while fetching scores." });
    }
});

module.exports = router;