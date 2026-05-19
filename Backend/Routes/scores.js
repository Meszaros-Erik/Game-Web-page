const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM scores ORDER BY score DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: "Szerverhiba a pontszámok beolvasásakor." });
    }
});

router.post('/', async (req, res) => {
    const { user_id, username, game_title, score } = req.body;
    try {
        const sql = `INSERT INTO scores (user_id, username, game_title, score) VALUES (?, ?, ?, ?)`;
        await pool.query(sql, [user_id, username, game_title, score]);
        res.status(201).json({ success: true, message: "Pontszám hozzáadva!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Szerverhiba a mentés során." });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, username, game_title, score } = req.body;
    try {
        const sql = `UPDATE scores SET user_id = ?, username = ?, game_title = ?, score = ? WHERE id = ?`;
        await pool.query(sql, [user_id, username, game_title, score, id]);
        res.status(200).json({ success: true, message: "Pontszám frissítve!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Szerverhiba a frissítés során." });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM scores WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: "Pontszám törölve!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Szerverhiba a törlés során." });
    }
});

module.exports = router;