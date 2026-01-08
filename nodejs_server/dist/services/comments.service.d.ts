import { CreateCommentInput, UpdateCommentInput } from "../modules/comments/comments.schema";
export declare class CommentService {
    static createComment(data: CreateCommentInput): Promise<{
        users: {
            username: string;
            photo_url: string | null;
            id: string;
        };
    } & {
        id: string;
        user_id: string;
        post_id: string;
        created_at: Date | null;
        text: string;
    }>;
    static getCommentsByPostId(post_id: string): Promise<({
        users: {
            username: string;
            photo_url: string | null;
            id: string;
        };
    } & {
        id: string;
        user_id: string;
        post_id: string;
        created_at: Date | null;
        text: string;
    })[]>;
    static updateComment(id: string, data: UpdateCommentInput): Promise<{
        id: string;
        user_id: string;
        post_id: string;
        created_at: Date | null;
        text: string;
    }>;
    static deleteComment(id: string): Promise<{
        id: string;
        user_id: string;
        post_id: string;
        created_at: Date | null;
        text: string;
    }>;
}
//# sourceMappingURL=comments.service.d.ts.map