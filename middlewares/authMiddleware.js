import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token not provided" });
    }

    try {
        // valida el token con la llave secreta.
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (Date.now > payload.exp) {
            return res.status(401).send({error: "token expired"});
        }
        req.user = payload;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;
