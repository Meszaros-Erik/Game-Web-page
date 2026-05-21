const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all games
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM games');
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Error fetching games:", error);
        res.status(500).json({ success: false, message: "Server error while fetching games." });
    }
});

// Add a new game (POST)
router.post('/', async (req, res) => {
    const { title, category, min_players, developer, status, image_link, game_link, description } = req.body;
    const sql = `INSERT INTO games (title, category, min_players, developer, status, image_link, game_link, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        await pool.query(sql, [title, category, min_players, developer, status, image_link, game_link, description]);
        res.status(201).json({ success: true, message: "Game added successfully!" });
    } catch (error) {
        console.error("❌ Error adding game:", error);
        res.status(500).json({ success: false, message: "Server error while adding the game." });
    }
});

// Modify an existing game (PUT)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category, min_players, developer, status, image_link, game_link, description } = req.body;
    try {
        const sql = `UPDATE games SET title = ?, category = ?, min_players = ?, developer = ?, status = ?, image_link = ?, game_link = ?, description = ? WHERE id = ?`;
        
        const [result] = await pool.query(sql, [title, category, min_players, developer, status, image_link, game_link, description, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Game not found!" });
        }
        
        res.status(200).json({ success: true, message: "Game updated successfully!" });
    } catch (error) {
        console.error("❌ Error updating game:", error);
        res.status(500).json({ success: false, message: "Server error while updating the game." });
    }
});

// Delete a game (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM games WHERE id = ?', [req.params.id]);
        res.status(200).json({ success: true, message: "Game deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting game:", error);
        res.status(500).json({ success: false, message: "Server error while deleting the game." });
    }
});

module.exports = router;