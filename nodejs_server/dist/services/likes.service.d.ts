import { CreateLikeInput } from '../modules/likes/likes.schema';
export declare class LikeService {
    static createLike(data: CreateLikeInput): Promise<{
        user_id: string;
        post_id: string;
    }>;
    static getAllLikesOfAPost(post_id: string): Promise<{
        user_id: string;
        post_id: string;
    }[]>;
    static getAllLikesOfAUser(user_id: string): Promise<{
        user_id: string;
        post_id: string;
    }[]>;
    static deleteLike(user_id: string, post_id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    static getLike(user_id: string, post_id: string): Promise<{
        user_id: string;
        post_id: string;
    } | null>;
}
//# sourceMappingURL=likes.service.d.ts.map