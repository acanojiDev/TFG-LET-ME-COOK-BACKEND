import { Request, Response } from 'express';
export declare class PostController {
    static save(req: Request, res: Response): Promise<void>;
    static unsave(req: Request, res: Response): Promise<void>;
    static getSaved(req: Request, res: Response): Promise<void>;
    static createPost(req: Request, res: Response): Promise<void>;
    static getPosts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPostById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updatePost(req: Request, res: Response): Promise<void>;
    static deletePost(req: Request, res: Response): Promise<void>;
    static getUserPosts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=post.controller.d.ts.map