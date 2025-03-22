import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  pin: { type: String, required: true, minlength: 6, maxlength: 6 },
  name: { type: String, required: true },
  birthdate: { type: Date, required: true },
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }], // Nueva referencia a perfiles
}, { timestamps: true });

export default mongoose.model("User", userSchema, "Usuarios");