import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dbConfig from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import playlistRoutes from './routes/playlistRoutes.js';
import videoRoutes from './routes/videoRoutes.js';

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