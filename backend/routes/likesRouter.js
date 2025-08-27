import express from 'express';
import { conectarDB } from '../db/db.js';

const router = express.Router();

// Save a like from a post
router.post('/', async (req, res) => {
    const { user_id, post_id } = req.body;

    try {
        const connection = await conectarDB();
        const [existingLike] = await connection.execute(
            'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
            [user_id, post_id]
        );

        if (existingLike.length > 0) {
            await connection.end();
            return res.status(409).json({ mensaje: 'This user has already liked this post' });
        }

        const query = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
        const [rows] = await connection.execute(query, [user_id, post_id]);
        await connection.end();
        
        res.status(201).json({ 
            mensaje: 'Like successfully added', 
            likeId: rows.insertId 
        });
        
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});


// Delete like
router.delete('/:likeId', async (req, res) => {
    const { likeId } = req.params;

    try {
        const connection = await conectarDB();
        const query = 'DELETE FROM likes WHERE like_id = ?';
        const [rows] = await connection.execute(query, [likeId]);
        await connection.end();

        if (rows.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Like not found' });
        }
        
        res.status(200).json({ mensaje: 'Like successfully eliminated' });
    } catch (error) {
        console.error('Error deleting like:', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Likes filtered by post_id
router.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = ('SELECT * FROM likes WHERE post_id = ?');
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: "Server error" });
    }
});


export default router;