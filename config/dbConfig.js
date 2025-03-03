import mongoose from "mongoose";
import 'dotenv/config';

class Database {
  constructor() {
    this.connectDB();
  }

  async connectDB() {
    try {
      await mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/workshop2?retryWrites=true&w=majority`);
      console.log("Conectado a la BD...");
    } catch (error) {
      console.error("Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }
}

export default new Database();