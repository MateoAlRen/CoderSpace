import express from 'express';
import { conectarDB } from '../db/db.js';

const router = express.Router();

// Comments
// Get all comments
router.get('/', async (req, res) => {
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM commentary');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Get a comment by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = ('SELECT * FROM commentary WHERE comment_id = ?');
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: "Server error" });
    }
});

// Create comment
router.post('/', async (req, res) => {
    const { comment_description, user_id, post_id } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('INSERT INTO commentary (comment_description, user_id, post_id) VALUES (?, ?, ?)');
        const [rows] = await connection.execute(query, [ comment_description, user_id, post_id ]);
        await connection.end();
        res.status(201).json({ mensaje: "comment successfully created" });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Update comment
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { comment_description, user_id, post_id } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('UPDATE commentary SET comment_description = ?, user_id = ?, post_id = ? WHERE comment_id = ?');
        const [rows] = await connection.execute(query, [ comment_description, user_id, post_id, id]);
        await connection.end();
        res.status(200).json({ mensaje: 'comment successfully updated' });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Delete comment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = 'DELETE FROM commentary WHERE comment_id = ?';
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.status(200).json({ mensaje: "comment successfully deleted" });
    } catch (error) {
        console.error("Server error", error);
        res.status(500).json({ mensaje:'Server error' });
    }
});

export default router;

