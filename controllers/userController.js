import User from "../models/userModel.js";

/**
 * Creates a user
 *
 * @param {*} req
 * @param {*} res
 */
const userCreate = (req, res) => {
    let user = new User();

    user.email = req.body.email;
    user.password = req.body.password;
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
        user.save()
            .then(() => {
                res.status(201);
                res.header({
                    'location': `/users/?id=${user.id}`
                });
                res.json(user);
            })
            .catch((err) => {
                res.status(422);
                console.log('Error while saving the user', err);
                res.json({
                    error: 'There was an error saving the user'
                });
            });
    } else {
        res.status(422);
        console.log('Error while saving the user');
        res.json({
            error: 'No valid data provided for user'
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
                res.status(500);
                console.log('Error while querying the user', err);
                res.json({ error: "There was an error" });
            });
    } else {
        User.find()
            .then(users => {
                res.json(users);
            })
            .catch(err => {
                res.status(422).json({ error: err });
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

export { userCreate, userGet, userUpdate, userDelete };
