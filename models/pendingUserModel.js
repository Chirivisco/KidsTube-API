import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  verificationToken: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // El documento se eliminará después de 24 horas
  }
}, { collection: 'Usuario_Pendiente' });

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser; 