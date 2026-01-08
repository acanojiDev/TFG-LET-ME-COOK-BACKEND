"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
/**
 * Middleware de manejo de errores global para Express
 * Captura todos los errores y los formatea de manera consistente
 */
function errorHandler(err, req, res, next) {
    // Si la respuesta ya fue enviada, delegar al handler por defecto de Express
    if (res.headersSent) {
        return next(err);
    }
    // Manejar errores de validación de Zod
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.issues.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
    }
    // Manejar errores con código de estado HTTP
    if (err.status || err.statusCode) {
        return res.status(err.status || err.statusCode).json({
            error: err.message || 'Error en la petición',
        });
    }
    // Manejar errores de GraphQL (si vienen de Apollo Server)
    if (err.extensions) {
        return res.status(err.extensions.code === 'UNAUTHENTICATED' ? 401 : 500).json({
            error: err.message || 'Error en la petición GraphQL',
        });
    }
    // Error genérico del servidor
    console.error('Error no manejado:', err);
    return res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : err.message || 'Error interno del servidor',
    });
}
//# sourceMappingURL=errorHandler.js.map