import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  phone: { type: String, required: false },
  pin: { type: String, required: false, minlength: 6, maxlength: 6 },
  name: { type: String, required: true },
  birthdate: { type: Date, required: false },
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' }
}, { timestamps: true });

export default mongoose.model("User", userSchema, "Usuarios");