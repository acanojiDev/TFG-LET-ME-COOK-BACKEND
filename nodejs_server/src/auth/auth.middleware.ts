// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar token JWT de Supabase
 * Este middleware debe ser usado en las rutas protegidas
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
        code: 'UNAUTHORIZED'
      });
    }

    // Extraer token del header "Bearer {token}"
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }

    // Verificar token con la clave secreta de Supabase JWT
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

    // Guardar información del usuario en req.user
    req.user = {
      id: decoded.sub,              // Supabase user ID (UUID)
      email: decoded.email,
      role: decoded.role || 'user',
      aud: decoded.aud,
      iat: decoded.iat,
      exp: decoded.exp
    };

    console.log(`✅ Token verificado para usuario: ${req.user.id}`);
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);

    // Distinguir entre diferentes tipos de errores
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o malformado',
        code: 'INVALID_TOKEN'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Error verificando autenticación',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware opcional para verificar roles del usuario
 * Uso: router.post('/admin-only', verifyToken, verifyRole('admin'), handler)
 */
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere rol: ${requiredRole}`,
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

/**
 * Middleware para logging de peticiones autenticadas
 */
const logAuthRequest = (req, res, next) => {
  if (req.user) {
    console.log(`[AUTH] ${req.method} ${req.path} - Usuario: ${req.user.email}`);
  }
  next();
};

module.exports = {
  verifyToken,
  verifyRole,
  logAuthRequest
};
