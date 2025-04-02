import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import path from 'path';

/**
 * Creates a user
 *
 * @param {*} req
 * @param {*} res
 */
const userCreate = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let user = new User({
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      pin: req.body.pin,
      name: req.body.name,
      birthdate: req.body.birthdate,
    });

    // comprueba la mayoría de edad del usuario
    const birthDate = new Date(user.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      return res.status(400).json({ error: "User must be at least 18 years old" });
    }

    // guarda el usuario
    await user.save();

    // crea el perfil main para el nuevo usuario
    const mainProfile = new Profile({
      fullName: user.name,
      pin: user.pin,
      avatar: path.join('Images', 'default-avatar.jpg'), // avatar predeterminado
      user: user._id,
      role: "main",
    });

    await mainProfile.save();

    user.profiles.push(mainProfile._id);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
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
    // valida existencia del email.
    const emailExists = await User.findOne({ email });

    // valida la contraseña.
    const passwordExists = await bcrypt.compare(password, emailExists.password);
    if (!passwordExists  || !emailExists) {
      return res.status(401).json({ error: "Incorrect user or password" });
    }

    // token jwt
    const token = jwt.sign(
      {
        id: emailExists._id,
        email: emailExists.email
      },
      process.env.JWT_SECRET, //llave secreta 
      {
        expiresIn: Date.now() + 60 * 1000 //expira en 1 minuto
      });

    res.json({
      message: "Loged in",
      token,
      user: { id: emailExists._id, name: emailExists.name, email: emailExists.email },
    });


  } catch (e) {
    res.status(422).json({"error":e.message});
  }
}

export { userCreate, userGet, userUpdate, userDelete, userLogin };