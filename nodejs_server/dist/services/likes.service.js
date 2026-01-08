"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const database_1 = require("../config/database");
const likeInclude = {
    user: {
        select: {
            id: true,
        },
    },
    post: {
        select: {
            id: true,
        },
    },
};
class LikeService {
    static async createLike(data) {
        return database_1.prisma.likes.create({
            data,
        });
    }
    static async getAllLikesOfAPost(post_id) {
        return database_1.prisma.likes.findMany({
            where: {
                post_id: post_id
            }
        });
    }
    static async getAllLikesOfAUser(user_id) {
        return database_1.prisma.likes.findMany({
            where: {
                user_id: user_id
            }
        });
    }
    static async deleteLike(user_id, post_id) {
        return database_1.prisma.likes.deleteMany({
            where: {
                post_id: post_id,
                user_id: user_id
            }
        });
    }
    static async getLike(user_id, post_id) {
        return database_1.prisma.likes.findUnique({
            where: {
                user_id_post_id: {
                    user_id: user_id,
                    post_id: post_id
                }
            }
        });
    }
}
exports.LikeService = LikeService;
//# sourceMappingURL=likes.service.js.map