import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dbConfig from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import playlistRoutes from './routes/playlistRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Verificar variables de entorno
console.log('Verificando variables de entorno:', {
  BREVO_API_KEY: process.env.BREVO_API_KEY ? 'Definida' : 'No definida',
  JWT_SECRET: process.env.JWT_SECRET ? 'Definida' : 'No definida'
});

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(cors({ domains: "*", methods: "*" }));

// Rutas
app.use("/users", userRoutes);
app.use("/profiles", profileRoutes);
app.use('/api', playlistRoutes);
app.use('/api', videoRoutes);

// Middleware para servir archivos estáticos
app.use('/Images', express.static(path.join(__dirname, 'Images')));

app.listen(3001, () => console.log("Servidor corriendo en el puerto 3001"));
console.log(dbConfig.db);