/**
 * Middleware para verificar el rol del usuario.
 * @param {Array} allowedRoles - Lista de roles permitidos para acceder al recurso.
 * @returns {Function} Middleware que verifica el rol del usuario.
 */
const roleMiddleware = (allowedRoles) => (req, res, next) => {
    // Verifica si el usuario tiene uno de los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied. You do not have the required role." });
    }

    // Si el rol es válido, pasa al siguiente middleware o controlador
    next();
};

export default roleMiddleware;
