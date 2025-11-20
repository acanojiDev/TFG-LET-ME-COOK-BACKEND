import { Router } from 'express';
import { LikesController } from './likes.controller';

const router = Router();

//TODO SWAGGER
router.post('/', LikesController.createLike);

//TODO SWAGGER
// Rutas más específicas primero
router.delete('/:userId/:postId', LikesController.deleteLike);

//TODO SWAGGER
router.get('/posts/:postId', LikesController.getAllLikesOfAPost);

//TODO SWAGGER
router.get('/users/:userId', LikesController.getAllLikesOfAUser);

export default router;

