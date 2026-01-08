"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const database_1 = require("../config/database");
class CommentService {
    static async createComment(data) {
        return await database_1.prisma.comments.create({
            data,
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        photo_url: true,
                    },
                },
            },
        });
    }
    static async getCommentsByPostId(post_id) {
        return await database_1.prisma.comments.findMany({
            where: { post_id },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        photo_url: true,
                    },
                },
            },
            orderBy: { created_at: "asc" },
        });
    }
    static async updateComment(id, data) {
        return await database_1.prisma.comments.update({
            where: { id },
            data,
        });
    }
    static async deleteComment(id) {
        return await database_1.prisma.comments.delete({
            where: { id },
        });
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=comments.service.js.map