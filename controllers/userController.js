import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import PendingUser from "../models/pendingUserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import path from 'path';
import { sendVerificationEmail } from '../services/emailService.js';
import { generateVerificationCode, sendVerificationSMS } from '../services/smsService.js';
import { OAuth2Client } from 'google-auth-library';

/**
 * Cliente de OAuth2 para verificar tokens de Google
 * Se inicializa con el ID de cliente de Google desde las variables de entorno
 */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Agregar logs de depuración
console.log('Variables de entorno cargadas:', {
  BREVO_API_KEY: process.env.BREVO_API_KEY ? 'Definida' : 'No definida',
  JWT_SECRET: process.env.JWT_SECRET ? 'Definida' : 'No definida'
});

/**
 * Creates a user
 *
 * @param {*} req
 * @param {*} res
 */
const userCreate = async (req, res) => {
  try {
    // Validar campos requeridos
    const { email, password, phone, pin, name, birthdate } = req.body;
    if (!email || !password || !phone || !pin || !name || !birthdate) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Formato de email inválido" });
    }

    // Verificar si el email ya existe en usuarios o usuarios pendientes
    const existingUser = await User.findOne({ email });
    const existingPendingUser = await PendingUser.findOne({ email });
    
    if (existingUser || existingPendingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar token de verificación
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Crear usuario pendiente
    const pendingUser = new PendingUser({
      email,
      password: hashedPassword,
      phone,
      pin,
      name,
      birthdate,
      verificationToken
    });

    await pendingUser.save();

    // Enviar email de verificación
    const emailResult = await sendVerificationEmail(email, verificationToken);
    if (!emailResult.success) {
      console.error('Error enviando email de verificación:', emailResult.error);
      return res.status(500).json({ 
        error: "Error al enviar el email de verificación", 
        details: emailResult.error 
      });
    }

    res.status(201).json({
      message: "Por favor verifica tu email para completar el registro.",
      email: email
    });
  } catch (error) {
    console.error('Error creando usuario pendiente:', error);
    res.status(500).json({ 
      error: "Error al crear el usuario", 
      details: error.message
    });
  }
};

/**
 * Get all users or a specific user by ID
 *
 * @param {*} req
 * @param {*} res
 */
const userGet = (req, res) => {
  if (req.query && req.query.id) {
    User.findById(req.query.id)
      .then(user => {
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ error: "User doesn't exist" });
        }
      })
      .catch((err) => {
        res.status(500); // no pudo procesar la solicitud
        console.log('Error while querying the user', err);
        res.json({ error: "There was an error" });
      });
  } else {
    User.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(422).json({ error: err }); // problema en los datos
      });
  }
};

/**
 * Update a user by ID
 *
 * @param {*} req
 * @param {*} res
 */
const userUpdate = (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    // actualiza el usuario
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      // retorna el usuario actualizado
      res.json(updatedUser);
    })
    .catch(err => {
      res.status(500).json({ error: "Error updating user", details: err });
    });
};

/**
 * Delete a user by ID
 *
 * @param {*} req
 * @param {*} res
 */
const userDelete = (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  User.findByIdAndDelete(req.params.id)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    })
    .catch(err => {
      res.status(500).json({ error: "Error deleting user", details: err });
    });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        error: "Cuenta no verificada", 
        message: "Por favor verifica tu correo electrónico antes de iniciar sesión" 
      });
    }

    // Si el usuario se autenticó con Google, no requiere verificación SMS
    if (user.authProvider === 'google') {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profiles: user.profiles
        }
      });
    }

    const passwordExists = await bcrypt.compare(password, user.password);
    if (!passwordExists) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar código de verificación SMS solo para usuarios locales
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.smsVerificationCode = verificationCode;
    user.smsVerificationExpires = verificationExpires;
    await user.save();

    const smsResult = await sendVerificationSMS(user.phone, verificationCode);
    if (!smsResult.success) {
      return res.status(500).json({ error: "Error al enviar el código de verificación" });
    }

    const tempToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        needsSmsVerification: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.json({
      message: "Código de verificación enviado",
      tempToken,
      needsSmsVerification: true
    });

  } catch (e) {
    res.status(422).json({"error": e.message});
  }
};

const verifySmsCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.smsVerificationCode || !user.smsVerificationExpires) {
      return res.status(400).json({ error: "No hay código de verificación pendiente" });
    }

    if (new Date() > user.smsVerificationExpires) {
      return res.status(400).json({ error: "Código de verificación expirado" });
    }

    if (code !== user.smsVerificationCode) {
      return res.status(400).json({ error: "Código de verificación incorrecto" });
    }

    // Limpiar código de verificación
    user.smsVerificationCode = undefined;
    user.smsVerificationExpires = undefined;
    await user.save();

    // Generar token final
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Verificación exitosa",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Error en la verificación" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    console.log('REST API - Verificación de email iniciada:', {
      originalUrl: req.originalUrl,
      query: req.query,
      params: req.params,
      headers: req.headers
    });

    const token = req.query.token;
    
    if (!token) {
      console.log('REST API - Error: Token no proporcionado en la petición');
      return res.status(400).json({ error: "Token no proporcionado" });
    }

    console.log('REST API - Token recibido:', token);

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('REST API - Token decodificado:', decoded);
    
    // Buscar usuario pendiente por email
    const pendingUser = await PendingUser.findOne({ email: decoded.email });
    console.log('REST API - Usuario pendiente encontrado:', pendingUser ? 'Sí' : 'No');
    
    if (!pendingUser) {
      console.log('REST API - Error: Usuario pendiente no encontrado');
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Crear el usuario real
    const user = new User({
      email: pendingUser.email,
      password: pendingUser.password,
      phone: pendingUser.phone,
      pin: pendingUser.pin,
      name: pendingUser.name,
      birthdate: pendingUser.birthdate,
      isVerified: true
    });

    await user.save();

    // Crear perfil principal
    const mainProfile = new Profile({
      fullName: pendingUser.name,
      pin: pendingUser.pin,
      avatar: path.join('Images', 'default-avatar.jpg'),
      user: user._id,
      role: "main",
    });

    await mainProfile.save();

    user.profiles.push(mainProfile._id);
    await user.save();

    // Eliminar usuario pendiente
    await PendingUser.deleteOne({ email: decoded.email });
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/verify-email?status=success`);
  } catch (error) {
    console.error('Error en verificación de email:', error);
    if (error.name === 'JsonWebTokenError') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/verify-email?status=error&message=Token inválido`);
    }
    if (error.name === 'TokenExpiredError') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/verify-email?status=error&message=Token expirado`);
    }
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/verify-email?status=error&message=Error al verificar el email`);
  }
};

/**
 * Controlador para la autenticación con Google OAuth2.0
 * 
 * Este controlador maneja el proceso de autenticación cuando un usuario
 * inicia sesión o se registra usando su cuenta de Google.
 * 
 * Flujo del proceso:
 * 1. Recibe el token de credencial de Google desde el frontend
 * 2. Verifica el token con la API de Google
 * 3. Extrae la información del usuario (email, nombre, ID de Google, foto)
 * 4. Busca si el usuario ya existe en la base de datos
 * 5. Si no existe, crea un nuevo usuario y su perfil principal
 * 6. Genera un token JWT para la sesión
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.credential - Token de credencial de Google
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Respuesta con token JWT y datos del usuario
 */
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Validación del token de credencial
    if (!credential) {
      console.error('No se recibió el credential en la petición');
      return res.status(400).json({ error: "Credential no proporcionado" });
    }

    console.log('Intentando verificar token de Google con client ID:', process.env.GOOGLE_CLIENT_ID);
    
    // Verificación del token con Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    // Extracción de datos del usuario de Google
    const payload = ticket.getPayload();
    console.log('Payload de Google recibido:', payload);
    
    const { email, name, sub: googleId, picture } = payload;

    // Búsqueda de usuario existente por email o ID de Google
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (!user) {
      console.log('Creando nuevo usuario de Google');
      // Creación de nuevo usuario
      user = new User({
        email,
        name,
        googleId,
        authProvider: 'google',
        isVerified: true, // Los usuarios de Google ya están verificados
        profiles: [] // Inicialización del array de perfiles
      });

      await user.save();

      // Creación del perfil principal
      const mainProfile = new Profile({
        fullName: name,
        avatar: picture || path.join('Images', 'default-avatar.jpg'),
        user: user._id,
        role: "main",
        pin: "000000" // PIN por defecto para usuarios de Google
      });

      const savedProfile = await mainProfile.save();
      
      // Asociación del perfil con el usuario
      user.profiles.push(savedProfile._id);
      await user.save();

      console.log('Perfil principal creado:', savedProfile);
    }

    // Generación del token JWT para la sesión
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    // Respuesta exitosa con token y datos del usuario
    res.json({
      message: "Inicio de sesión con Google exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profiles: user.profiles // Inclusión de los perfiles en la respuesta
      }
    });

  } catch (error) {
    // Manejo detallado de errores
    console.error('Error detallado en autenticación de Google:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: "Error en la autenticación de Google",
      details: error.message 
    });
  }
};

const resendSmsCode = async (req, res) => {
    try {
        const { tempToken } = req.body;
        
        if (!tempToken) {
            return res.status(400).json({ error: 'Token temporal requerido' });
        }

        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const verificationCode = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await sendVerificationSMS(user.phone, verificationCode);

        user.smsVerificationCode = verificationCode;
        user.smsVerificationExpires = expiresAt;
        await user.save();

        res.json({ message: 'Código reenviado exitosamente' });
    } catch (error) {
        console.error('Error al reenviar código SMS:', error);
        res.status(500).json({ error: 'Error al reenviar el código de verificación' });
    }
};

export { userCreate, userGet, userUpdate, userDelete, userLogin, verifyEmail, googleAuth, verifySmsCode, resendSmsCode };