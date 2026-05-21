const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
    const { userId, gameId } = req.body;
    
    if (!userId || !gameId) {
        return res.status(400).json({ success: false, message: "Missing user or game ID!" });
    }
    
    try {
        const [existing] = await pool.query('SELECT * FROM Favorites WHERE user_id = ? AND game_id = ?', [userId, gameId]);
        
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "This game is already on your wishlist!" });
        }

        await pool.query('INSERT INTO Favorites (user_id, game_id) VALUES (?, ?)', [userId, gameId]);
        res.status(200).json({ success: true, message: "Game added to your wishlist!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while saving the wishlist." });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const [rows] = await pool.query(
            `SELECT f.id AS favorite_id, g.id AS game_id, g.title, g.image_link, g.game_link 
            FROM Favorites f 
            JOIN Games g ON f.game_id = g.id 
            WHERE f.user_id = ?`, 
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while fetching the wishlist." });
    }
});

router.delete('/', async (req, res) => {
    const { userId, gameId } = req.body;
    
    if (!userId || !gameId) {
        return res.status(400).json({ success: false, message: "Missing user or game ID!" });
    }
    
    try {
        await pool.query('DELETE FROM Favorites WHERE user_id = ? AND game_id = ?', [userId, gameId]);
        res.status(200).json({ success: true, message: "Game removed from your wishlist!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while removing the game." });
    }
});

module.exports = router;