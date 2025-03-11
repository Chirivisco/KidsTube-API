import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

/**
 * Creates a user
 *
 * @param {*} req
 * @param {*} res
 */
const userCreate = async (req, res) => {
    //console.log("Datos recibidos en el bckend:", req.body);
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let user = new User();

        user.email = req.body.email;
        user.password = hashedPassword;
        user.phone = req.body.phone;
        user.pin = req.body.pin;
        user.name = req.body.name;
        user.country = req.body.country;
        user.birthdate = req.body.birthdate;

        // comprueba la mayoría de edad dl usuario
        const birthDate = new Date(user.birthdate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 18) {
            return res.status(400).json({ error: "User must be at least 18 years old" });
        }

        // comprueba que exista un email y contrasena
        if (user.email && user.password) {
            // guarda el usuario

            await user.save();
            res.status(201).json(user);

            await user.save()
                .then(() => {
                    res.status(201);
                    res.header({
                        'location': `/users/?id=${user.id}`
                    });
                    res.json(user);
                });
        } else {
            res.status(422);
            console.log('Error while saving the user');
            res.json({
                error: 'No valid data provided for user'
            });
        }
    } catch (e) {
        res.status(422);
        console.log('Error while saving the user', e);
        res.json({
            error: 'There was an error saving the user'
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
            // retorna el usuario acctualizado
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
        if (!emailExists) {
            return res.status(401).json({ error: "User not found" });
        }

        // valida la contraseña.
        const passwordExists = await bcrypt.compare(password, emailExists.password);
        if (!passwordExists) {
            return res.status(401).json({ error: "Incorrect password" });
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
