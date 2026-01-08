"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("./post.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crea una nueva publicación
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - type
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               type:
 *                 type: string
 *                 enum: [recipe, photo, video, text]
 *                 example: recipe
 *               content:
 *                 type: string
 *                 example: Esta es una receta deliciosa
 *               media_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
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
router.post("/:id/save", post_controller_1.PostController.save);
router.delete("/:id/save/:postId", post_controller_1.PostController.unsave);
router.get("/:id/saved", post_controller_1.PostController.getSaved);
router.post("/", post_controller_1.PostController.createPost);
/**
 * TODO SWAGGER
**/
router.get('/', post_controller_1.PostController.getPosts);
router.get('/user/:target_user_id', post_controller_1.PostController.getUserPosts);
/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obtiene una publicación por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la publicación (UUID)
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error al obtener la publicación
 */
router.get('/:id', post_controller_1.PostController.getPostById);
/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Actualiza una publicación
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la publicación (UUID)
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *                 enum: [recipe, photo, video, text]
 *               content:
 *                 type: string
 *               media_url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
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
 *         description: Error al actualizar la publicación
 */
router.put('/:id', post_controller_1.PostController.updatePost);
/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Elimina una publicación
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la publicación (UUID)
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error al eliminar la publicación
 */
router.delete('/:id', post_controller_1.PostController.deletePost);
exports.default = router;
//# sourceMappingURL=post.routes.js.map