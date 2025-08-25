import express from 'express';
import { conectarDB } from '../db/db.js';

const router = express.Router();

// Comentarios
// Obtener todos los comentarios
router.get('/', async (req, res) => {
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM commentary');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Obtener un comentario por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = ('SELECT * FROM commentary WHERE comment_id = ?');
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
});

// Crear cometario
router.post('/', async (req, res) => {
    const { comment_description, user_id, post_id } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('INSERT INTO commentary (comment_description, user_id, post_id) VALUES (?, ?, ?)');
        const [rows] = await connection.execute(query, [ comment_description, user_id, post_id ]);
        await connection.end();
        res.status(201).json({ mensaje: "Usuario creado con éxito" });
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Actualizar comentario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { comment_description, user_id, post_id } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('UPDATE commentary SET comment_description = ?, user_id = ?, post_id = ? WHERE comment_id = ?');
        const [rows] = await connection.execute(query, [ comment_description, user_id, post_id, id]);
        await connection.end();
        res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Eliminar comentario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = 'DELETE FROM commentary WHERE comment_id = ?';
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
    } catch (error) {
        console.error("Error del servidor", error);
        res.status(500).json({ mensaje:'Error del servidor' });
    }
});

export default router;

