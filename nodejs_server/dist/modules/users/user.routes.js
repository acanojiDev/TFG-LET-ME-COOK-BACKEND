"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./userController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password_hash
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: juan123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password_hash:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               photo_url:
 *                 type: string
 *                 example: https://example.com/photo.jpg
 *               bio:
 *                 type: string
 *                 example: Desarrollador web
 *               location:
 *                 type: string
 *                 example: Madrid, España
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Error en los datos
 */
// TODO router.post('/', UserController.createUser);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       photo_url:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       location:
 *                         type: string
 *                       registered_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Error al obtener usuarios
 */
router.get('/', userController_1.UserController.getAllUsers);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
router.get('/:id', userController_1.UserController.getUserById);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *               email:
 *                 type: string
 *                 format: email
 *               password_hash:
 *                 type: string
 *                 minLength: 6
 *               photo_url:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Error en los datos
 *       500:
 *         description: Error al actualizar el usuario
 */
router.put('/:id', userController_1.UserController.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 */
router.delete('/:id', userController_1.UserController.deleteUser);
router.post("/:id/follow", userController_1.UserController.follow);
router.delete("/:id/follow/:followedId", userController_1.UserController.unfollow);
router.get("/:id/followers", userController_1.UserController.getFollowers);
router.get("/:id/following", userController_1.UserController.getFollowing);
// Settings
router.patch("/:id/settings", userController_1.UserController.updateSettings);
router.get("/:id/settings", userController_1.UserController.getSettings);
exports.default = router;
//# sourceMappingURL=user.routes.js.map