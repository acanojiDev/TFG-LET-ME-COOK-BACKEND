import {Router} from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('signout', authController.signOut);

export default router;