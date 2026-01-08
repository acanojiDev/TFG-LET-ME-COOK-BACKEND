import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user.service';
import { createUserSchema, updateUserSchema, followUserSchema, updateSettingsSchema } from './user.schema';

export class UserController {
    static async follow(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params; // follower_id (usually from auth token, but using params for now as requested context implies general access)
            const { followed_id } = followUserSchema.parse(req.body);
            await UserService.followUser(id, followed_id);
            res.status(200).json({ message: "User followed" });
        } catch (error) {
            next(error);
        }
    }

    static async unfollow(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, followedId } = req.params;
            await UserService.unfollowUser(id, followedId);
            res.status(200).json({ message: "User unfollowed" });
        } catch (error) {
            next(error);
        }
    }

    static async getFollowers(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const followers = await UserService.getFollowers(id);
            res.json(followers);
        } catch (error) {
            next(error);
        }
    }

    static async getFollowing(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const following = await UserService.getFollowing(id);
            res.json(following);
        } catch (error) {
            next(error);
        }
    }

    static async updateSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = updateSettingsSchema.parse(req.body);
            const settings = await UserService.updateSettings(id, data);
            res.json(settings);
        } catch (error) {
            next(error);
        }
    }

    static async getSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const settings = await UserService.getSettings(id);
            res.json(settings);
        } catch (error) {
            next(error);
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
            return res.status(200).json({ data: user });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
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
