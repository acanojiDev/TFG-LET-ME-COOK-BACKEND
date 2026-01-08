"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
class UserService {
    static async followUser(followerId, followedId) {
        return await database_1.prisma.follows.create({
            data: {
                follower_id: followerId,
                followed_id: followedId,
            },
        });
    }
    static async unfollowUser(followerId, followedId) {
        return await database_1.prisma.follows.delete({
            where: {
                follower_id_followed_id: {
                    follower_id: followerId,
                    followed_id: followedId,
                },
            },
        });
    }
    static async getFollowers(userId) {
        return await database_1.prisma.follows.findMany({
            where: { followed_id: userId },
            include: {
                users_follows_follower_idTousers: {
                    select: {
                        id: true,
                        username: true,
                        photo_url: true,
                    },
                },
            },
        });
    }
    static async getFollowing(userId) {
        return await database_1.prisma.follows.findMany({
            where: { follower_id: userId },
            include: {
                users_follows_followed_idTousers: {
                    select: {
                        id: true,
                        username: true,
                        photo_url: true,
                    },
                },
            },
        });
    }
    static async updateSettings(userId, data) {
        return await database_1.prisma.user_settings.upsert({
            where: { user_id: userId },
            update: data,
            create: {
                user_id: userId,
                ...data,
            },
        });
    }
    static async getSettings(userId) {
        return await database_1.prisma.user_settings.findUnique({
            where: { user_id: userId },
        });
    }
    static async createUser(data) {
        return await database_1.prisma.users.create({
            data,
        });
    }
    static async getAllUsers() {
        return await database_1.prisma.users.findMany({
            select: {
                id: true,
                username: true,
                photo_url: true,
                bio: true,
                location: true,
                registered_at: true,
                birth_date: true,
                updated_at: true,
            },
        });
    }
    static async getUserById(id) {
        return await database_1.prisma.users.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                photo_url: true,
                bio: true,
                location: true,
                registered_at: true,
                birth_date: true,
                updated_at: true,
            },
        });
    }
    static async updateUser(id, data) {
        return await database_1.prisma.users.update({
            where: { id },
            data,
            select: {
                id: true,
                username: true,
                photo_url: true,
                bio: true,
                location: true,
                registered_at: true,
                birth_date: true,
                updated_at: true,
            },
        });
    }
    static async deleteUser(id) {
        return await database_1.prisma.users.delete({
            where: { id },
        });
    }
    /**
     * Obtener el perfil completo de un usuario
     * Incluye: posts, número de posts, seguidores, seguidos
     */
    static async getUserProfile(userId) {
        const user = await database_1.prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                photo_url: true,
                bio: true,
                location: true,
                _count: {
                    select: {
                        posts: true,
                        follows_followers: true, // Seguidores (quienes me siguen)
                        follows_following: true, // Siguiendo (a quienes sigo)
                    }
                }
            }
        });
        if (!user) {
            return null;
        }
        return {
            ...user,
            postsCount: user._count.posts,
            followersCount: user._count.follows_followers,
            followingCount: user._count.follows_following,
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map