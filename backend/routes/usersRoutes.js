import express from 'express';
import { conectarDB } from '../db/db.js';

const router = express.Router();

// usuarios
// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM users');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Obtener un usuario por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = ('SELECT * FROM users WHERE user_id = ?');
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
});

// Crear usuario
router.post('/', async (req, res) => {
    const { 
        first_name, second_name, first_lastname, second_lastname, 
        user_email, user_password, user_photo, user_github, 
        user_linkedin, user_description, user_alias, skills_id 
    } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('INSERT INTO users (first_name, second_name, first_lastname, second_lastname,user_email, user_password, user_photo, user_github, user_linkedin, user_description, user_alias, skills_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        const [rows] = await connection.execute(query, [
            first_name, second_name, first_lastname, second_lastname,
            user_email, user_password, user_photo, user_github,
            user_linkedin, user_description, user_alias, skills_id
        ]);
        await connection.end();
        res.status(201).json({ mensaje: "Usuario creado con éxito" });
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        first_name, second_name, first_lastname, second_lastname, 
        user_email, user_password, user_photo, user_github, 
        user_linkedin, user_description, user_alias, skills_id 
    } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('UPDATE users SET first_name = ?, second_name = ?, first_lastname = ?, second_lastname = ?, user_email = ?, user_password = ?, user_photo = ?, user_github = ?, user_linkedin = ?, user_description = ?, user_alias = ?, skills_id = ? WHERE user_id = ?');
        const [rows] = await connection.execute(query, [
            first_name, second_name, first_lastname, second_lastname,
            user_email, user_password, user_photo, user_github,
            user_linkedin, user_description, user_alias, skills_id, id
        ]);
        await connection.end();
        res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error del servidor', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = 'DELETE FROM users WHERE user_id = ?';
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
    } catch (error) {
        console.error("Error del servidor", error);
        res.status(500).json({ mensaje:'Error del servidor' });
    }
});

export default router;