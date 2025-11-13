import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { signUpSchema, signInSchema } from './auth.schema';

const authService = new AuthService();

export class AuthController{
    async signUp(req: Request, res: Response){

    }

    async signIn(req: Request, res: Response){

    }

    async signOut(req: Request, res: Response){

    }
}