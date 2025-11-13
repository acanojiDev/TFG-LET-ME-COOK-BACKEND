import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { error } from 'console';
//Valida JWT
const authService = new AuthService();

export const authenticate = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; //Bearer TOKEN

        if(!token){
            return res.status(401).json({error: 'Token no proporcionado'});
        }
        const user = await authService.verifyToken(token);
        req.user = user; //Agregar user al request
        next();
    } catch (error) {
        res.status(401).json({error: 'Token inválido o expirado'});
    }
};