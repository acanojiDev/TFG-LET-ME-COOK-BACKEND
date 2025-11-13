import { Router } from 'express';
import { PostController } from './post.controller';

const router = Router();

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
router.post('/', PostController.createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtiene todas las publicaciones
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida exitosamente
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
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                       type:
 *                         type: string
 *                         enum: [recipe, photo, video, text]
 *                       content:
 *                         type: string
 *                       media_url:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           username:
 *                             type: string
 *                           photo_url:
 *                             type: string
 *       500:
 *         description: Error al obtener publicaciones
 */
router.get('/', PostController.getAllPosts);

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
router.get('/:id', PostController.getPostById);

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
router.put('/:id', PostController.updatePost);

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
router.delete('/:id', PostController.deletePost);

export default router;

