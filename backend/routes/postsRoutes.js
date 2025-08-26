import express from 'express';
import { conectarDB } from '../db/db.js';

const router = express.Router();

// Post
// Obtener todos los post
router.get('/', async (req, res) => {
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM post');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Obtener un post por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = ('SELECT * FROM post WHERE post_id = ?');
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
});

// Crear post
router.post('/', async (req, res) => {
    const { user_id , like_id , post_title , post_description, post_code } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('INSERT INTO post (user_id, like_id, post_title, post_description, post_code) VALUES (?, ?, ?, ?, ?)');
        const [rows] = await connection.execute(query, [ user_id, like_id, post_title, post_description, post_code ]);
        await connection.end();
        res.status(201).json({ mensaje: "Usuario creado con éxito" });
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Actualizar post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, like_id, post_title, post_description, post_code } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('UPDATE post SET user_id = ?, like_id = ?, post_title = ?, post_description = ?, post_code = ? WHERE post_id = ?');
        const [rows] = await connection.execute(query, [ user_id, like_id, post_title, post_description, post_code, id]);
        await connection.end();
        res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Eliminar post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = 'DELETE FROM post WHERE post_id = ?';
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
    } catch (error) {
        console.error("Error del servidor", error);
        res.status(500).json({ mensaje:'Error del servidor' });
    }
});

export default router;