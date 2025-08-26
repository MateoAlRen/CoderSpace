import express from 'express';
import { conectarDB } from '../db/db.js';

const router = express.Router();

// Post
// Get all posts
router.get('/', async (req, res) => {
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM post');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Get a post by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = ('SELECT * FROM post WHERE post_id = ?');
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: "Server error" });
    }
});

// Create post
router.post('/', async (req, res) => {
    const { user_id , like_id , post_title , post_description, post_code } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('INSERT INTO post (user_id, like_id, post_title, post_description, post_code) VALUES (?, ?, ?, ?, ?)');
        const [rows] = await connection.execute(query, [ user_id, like_id, post_title, post_description, post_code ]);
        await connection.end();
        res.status(201).json({ mensaje: "Post successfully created" });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Update post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, like_id, post_title, post_description, post_code } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('UPDATE post SET user_id = ?, like_id = ?, post_title = ?, post_description = ?, post_code = ? WHERE post_id = ?');
        const [rows] = await connection.execute(query, [ user_id, like_id, post_title, post_description, post_code, id]);
        await connection.end();
        res.status(200).json({ mensaje: 'Post successfully updated' });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = 'DELETE FROM post WHERE post_id = ?';
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.status(200).json({ mensaje: "Post successfully deleted" });
    } catch (error) {
        console.error("Server error", error);
        res.status(500).json({ mensaje:'Server error' });
    }
});

export default router;