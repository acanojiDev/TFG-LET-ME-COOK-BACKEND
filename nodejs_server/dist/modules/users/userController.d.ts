import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    static follow(req: Request, res: Response, next: NextFunction): Promise<void>;
    static unfollow(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFollowers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFollowing(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateSettings(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSettings(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllUsers(req: Request, res: Response): Promise<void>;
    static getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateUser(req: Request, res: Response): Promise<void>;
    static deleteUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=userController.d.ts.map