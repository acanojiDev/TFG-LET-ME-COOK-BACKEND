// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('./auth.middleware.ts');
const User = require('../models/User');

/**
 * POST /api/auth/sync
 * Sincronizar usuario de Supabase con la base de datos del backend
 * Llamado automáticamente desde el frontend después de login/signup
 *
 * Body:
 * {
 *   "id": "uuid-from-supabase",
 *   "email": "user@example.com",
 *   "user_metadata": {
 *     "username": "username",
 *     "photo_url": "https://...",
 *     "bio": "My bio",
 *     "location": "Madrid",
 *     "birth_date": "1990-01-01"
 *   },
 *   "last_sign_in_at": "2026-02-11T..."
 * }
 */
router.post('/sync', async (req, res) => {
  try {
    const { id, email, user_metadata, last_sign_in_at } = req.body;

    // Validar datos requeridos
    if (!id || !email) {
      return res.status(400).json({
        success: false,
        message: 'ID y email son requeridos',
        code: 'MISSING_FIELDS'
      });
    }

    console.log(`🔄 Sincronizando usuario: ${email} (${id})`);

    // Buscar o crear usuario en la base de datos
    // Usar upsert para que si existe se actualice, si no existe se cree
    const user = await User.findByIdAndUpdate(
      id,
      {
        id, // ID de Supabase (UUID)
        email,
        username: user_metadata?.username || email.split('@')[0],
        photo_url: user_metadata?.photo_url || null,
        bio: user_metadata?.bio || null,
        location: user_metadata?.location || null,
        birth_date: user_metadata?.birth_date || null,
        last_sign_in_at: last_sign_in_at ? new Date(last_sign_in_at) : new Date(),
        updated_at: new Date(),
        is_active: true
      },
      {
        upsert: true,           // Crear si no existe, actualizar si existe
        new: true,              // Retornar documento actualizado
        runValidators: true     // Ejecutar validadores del schema
      }
    );

    console.log(`✅ Usuario sincronizado: ${user.username}`);

    res.status(200).json({
      success: true,
      message: 'Usuario sincronizado correctamente',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        photo_url: user.photo_url
      }
    });
  } catch (error) {
    console.error('❌ Error sincronizando usuario:', error);

    res.status(500).json({
      success: false,
      message: 'Error sincronizando usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      code: 'SYNC_ERROR'
    });
  }
});

/**
 * GET /api/auth/me
 * Obtener datos del usuario autenticado
 * Requiere token JWT válido
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Del middleware de autenticación

    console.log(`👤 Obteniendo datos de usuario: ${userId}`);

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        photo_url: user.photo_url,
        bio: user.bio,
        location: user.location,
        birth_date: user.birth_date,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuario',
      code: 'GET_USER_ERROR'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Actualizar perfil del usuario autenticado
 * Requiere token JWT válido
 *
 * Body:
 * {
 *   "username": "nuevo_username",
 *   "bio": "Nueva bio",
 *   "location": "Nueva ciudad",
 *   "photo_url": "https://..."
 * }
 */
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    console.log(`📝 Actualizando perfil de usuario: ${userId}`);

    // Campos permitidos para actualizar (validación de seguridad)
    const allowedFields = ['username', 'bio', 'location', 'photo_url'];
    const updateData = {};

    for (const field of allowedFields) {
      if (field in updates) {
        updateData[field] = updates[field];
      }
    }

    // No permitir que se actualicen estos campos
    if (updates.id || updates.email || updates.role) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden actualizar id, email o role',
        code: 'INVALID_UPDATE_FIELDS'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    console.log(`✅ Perfil actualizado: ${user.username}`);

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        photo_url: user.photo_url,
        bio: user.bio,
        location: user.location
      }
    });
  } catch (error) {
    console.error('❌ Error actualizando perfil:', error);

    if (error.code === 11000) {
      // Error de duplicado (username, email, etc)
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `El ${field} ya está en uso`,
        code: 'DUPLICATE_FIELD'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error actualizando perfil',
      code: 'UPDATE_ERROR'
    });
  }
});

/**
 * DELETE /api/auth/account
 * Eliminar cuenta del usuario (solo admin o el propio usuario)
 */
router.delete('/account', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`🗑️ Eliminando cuenta de usuario: ${userId}`);

    const user = await User.findByIdAndUpdate(
      userId,
      { is_active: false, updated_at: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cuenta desactivada correctamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando cuenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando cuenta',
      code: 'DELETE_ERROR'
    });
  }
});

/**
 * GET /api/auth/verify
 * Verificar que el token es válido (health check de autenticación)
 */
router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token válido',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
