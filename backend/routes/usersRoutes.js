import express from 'express';
import { conectarDB } from '../db/db.js';

const router = express.Router();

// Users
// Get all users
router.get('/', async (req, res) => {
    try {
        const connection = await conectarDB();
        const [rows] = await connection.execute('SELECT * FROM users');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = ('SELECT * FROM users WHERE user_id = ?');
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: "Server error" });
    }
});

// Create user
router.post('/', async (req, res) => {
    const { first_name, user_email, user_password } = req.body;

    try {
        const connection = await conectarDB();
        const query = ('INSERT INTO users (first_name, user_email, user_password) VALUES (?, ?, ?)');
        const [rows] = await connection.execute(query, [ first_name, user_email, user_password ]);
        await connection.end();
        res.status(201).json({ mensaje: "User successfully created" });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Update user
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
        res.status(200).json({ mensaje: 'User successfully updated' });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ mensaje: 'Server error' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await conectarDB();
        const query = 'DELETE FROM users WHERE user_id = ?';
        const [rows] = await connection.execute(query, [id]);
        await connection.end();
        res.status(200).json({ mensaje: "User successfully deleted" });
    } catch (error) {
        console.error("Error del servidor", error);
        res.status(500).json({ mensaje:'Error del servidor' });
    }
});

export default router;