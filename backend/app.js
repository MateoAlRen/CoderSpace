// archivo principal punto entrada backend

// Importaciones
import express from 'express';
import cors from 'cors';  // Middleware necesario para que tu API pueda ser consumida desde un frontend.
import dotenv from 'dotenv'
import usersRoutes from './routes/usersRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import commentarysRoutes from './routes/commentsRoutes.js';

// cargar variables archivo .env
dotenv.config();

// Creacion app y configuracion puerto
const app = express();
const PORT = 3000;  // Número del puerto donde escuchará tu servidor (en este caso 3000).

// Middlewares globales
app.use(cors());  // Permite que tu API sea accesible desde otras aplicaciones web.
app.use(express.json());  // Permite que Express entienda cuerpos de peticiones en formato JSON

// Rutas
app.use('/users', usersRoutes);
app.use('/post', postsRoutes);
app.use('/commentary', commentarysRoutes);


// levanta el Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
