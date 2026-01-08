import { Request, Response } from "express";
export declare class LikesController {
    static createLike(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllLikesOfAPost(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllLikesOfAUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteLike(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static userHasLikedPost(userId: string, postId: string): Promise<boolean>;
}
//# sourceMappingURL=likes.controller.d.ts.map