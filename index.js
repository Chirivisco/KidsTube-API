import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dbConfig from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; // Importar las rutas de perfiles
import path from 'path';
import { fileURLToPath } from 'url';

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(cors({ domains: "*", methods: "*" }));

// Rutas
app.use("/users", userRoutes);
app.use("/profiles", profileRoutes); // Agregar las rutas de perfiles

// Middleware para servir archivos estáticos
app.use('/Images', express.static(path.join(__dirname, 'Images')));

app.listen(3001, () => console.log("Servidor corriendo en el puerto 3001"));
console.log(dbConfig.db);