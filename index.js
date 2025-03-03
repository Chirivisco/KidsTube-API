import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dbConfig from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(cors({ domains: "*", methods: "*" }));

//rutas
app.use("/users", userRoutes);

app.listen(3001, () => console.log("Servidor corriendo en el puerto 3001"));
console.log(dbConfig.db);