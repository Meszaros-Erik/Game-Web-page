const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM games');
    res.status(200).json(rows);
});

router.post('/', async (req, res) => {
    const { title, category, min_players, status, image_link, game_link, description } = req.body;
    const sql = `INSERT INTO games (title, category, min_players, status, image_link, game_link, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await pool.query(sql, [title, category, min_players, status, image_link, game_link, description]);
    res.status(201).json({ success: true, message: "Game added successfully!" });
});

router.delete('/:id', async (req, res) => {
    await pool.query('DELETE FROM games WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: "Game deleted successfully!" });
});

module.exports = router;