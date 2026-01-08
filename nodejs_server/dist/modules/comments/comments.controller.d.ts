import { Request, Response, NextFunction } from "express";
export declare class CommentController {
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getByPost(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=comments.controller.d.ts.map