import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  pin: { type: String, required: true, minlength: 6, maxlength: 6 },
  name: { type: String, required: true },
  country: { type: String, required: true },
  birthdate: { type: Date, required: true },
}, { timestamps: true }); // timestamps agrega cuando se creó y/o actualizó el usuario

export default mongoose.model("User", userSchema, "Usuarios");
