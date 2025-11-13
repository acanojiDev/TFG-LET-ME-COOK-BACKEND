import { Request, Response } from 'express';
import { UserService } from '../users/user.service';
import { createUserSchema, updateUserSchema } from './user.schema';

export class UserController {

    static async createUser(req: Request, res: Response) {
        try {
            const validatedData = createUserSchema.parse(req.body);
            const user = await UserService.createUser(validatedData);
            res.status(201).json({
                message: 'Usuario creado exitosamente',
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json({ data: users });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json({ data: user });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validatedData = updateUserSchema.parse(req.body);
            const user = await UserService.updateUser(id, validatedData);
            res.status(200).json({
                message: 'Usuario actualizado exitosamente',
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
