import mongoose from "mongoose";

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  fullName: { type: String, required: true },
  pin: { type: String, required: true, minlength: 6, maxlength: 6 },
  avatar: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["main", "restricted"], default: "restricted" },
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema, "Perfiles");