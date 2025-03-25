// Importa el módulo `jsonwebtoken` para manejar tokens JWT
import jwt from "jsonwebtoken";

// Importa `dotenv` para cargar variables de entorno desde un archivo `.env`
import dotenv from "dotenv";
dotenv.config(); // Carga las variables de entorno

/**
 * Middleware de autenticación para proteger rutas.
 * Este middleware verifica si el cliente envió un token válido en los encabezados de la solicitud.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
const authMiddleware = (req, res, next) => {
    // Obtiene el token del encabezado `Authorization` (formato: "Bearer <token>")
    const token = req.headers.authorization?.split(" ")[1];

    // Si no se proporciona un token, devuelve un error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({ error: "Access denied. Token not provided" });
    }

    try {
        // Valida el token usando la clave secreta definida en las variables de entorno
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Verifica si el token ha expirado
        if (Date.now() > payload.exp) {
            return res.status(401).send({ error: "Token expired" });
        }

        // Si el token es válido, agrega los datos del usuario al objeto `req`
        req.user = payload;

        // Llama a `next()` para pasar al siguiente middleware o controlador
        next();
    } catch (error) {
        // Si el token es inválido o ha expirado, devuelve un error 403 (Prohibido)
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;