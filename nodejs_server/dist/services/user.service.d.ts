import { CreateUserInput, UpdateSettingsInput, UpdateUserInput } from "../modules/users/user.schema";
export declare class UserService {
    static followUser(followerId: string, followedId: string): Promise<{
        followed_id: string;
        followed_at: Date | null;
        follower_id: string;
    }>;
    static unfollowUser(followerId: string, followedId: string): Promise<{
        followed_id: string;
        followed_at: Date | null;
        follower_id: string;
    }>;
    static getFollowers(userId: string): Promise<({
        users_follows_follower_idTousers: {
            username: string;
            photo_url: string | null;
            id: string;
        };
    } & {
        followed_id: string;
        followed_at: Date | null;
        follower_id: string;
    })[]>;
    static getFollowing(userId: string): Promise<({
        users_follows_followed_idTousers: {
            username: string;
            photo_url: string | null;
            id: string;
        };
    } & {
        followed_id: string;
        followed_at: Date | null;
        follower_id: string;
    })[]>;
    static updateSettings(userId: string, data: UpdateSettingsInput): Promise<{
        is_private: boolean | null;
        language: string | null;
        notify_likes: boolean | null;
        notify_comments: boolean | null;
        notify_follows: boolean | null;
        theme: string | null;
        user_id: string;
    }>;
    static getSettings(userId: string): Promise<{
        is_private: boolean | null;
        language: string | null;
        notify_likes: boolean | null;
        notify_comments: boolean | null;
        notify_follows: boolean | null;
        theme: string | null;
        user_id: string;
    } | null>;
    static createUser(data: CreateUserInput): Promise<{
        username: string;
        photo_url: string | null;
        bio: string | null;
        birth_date: Date;
        location: string | null;
        id: string;
        registered_at: Date | null;
        updated_at: Date | null;
    }>;
    static getAllUsers(): Promise<{
        username: string;
        photo_url: string | null;
        bio: string | null;
        birth_date: Date;
        location: string | null;
        id: string;
        registered_at: Date | null;
        updated_at: Date | null;
    }[]>;
    static getUserById(id: string): Promise<{
        username: string;
        photo_url: string | null;
        bio: string | null;
        birth_date: Date;
        location: string | null;
        id: string;
        registered_at: Date | null;
        updated_at: Date | null;
    } | null>;
    static updateUser(id: string, data: UpdateUserInput): Promise<{
        username: string;
        photo_url: string | null;
        bio: string | null;
        birth_date: Date;
        location: string | null;
        id: string;
        registered_at: Date | null;
        updated_at: Date | null;
    }>;
    static deleteUser(id: string): Promise<{
        username: string;
        photo_url: string | null;
        bio: string | null;
        birth_date: Date;
        location: string | null;
        id: string;
        registered_at: Date | null;
        updated_at: Date | null;
    }>;
    /**
     * Obtener el perfil completo de un usuario
     * Incluye: posts, número de posts, seguidores, seguidos
     */
    static getUserProfile(userId: string): Promise<{
        postsCount: number;
        followersCount: number;
        followingCount: number;
        username: string;
        photo_url: string | null;
        bio: string | null;
        location: string | null;
        id: string;
        _count: {
            follows_followers: number;
            follows_following: number;
            posts: number;
        };
    } | null>;
}
//# sourceMappingURL=user.service.d.ts.map