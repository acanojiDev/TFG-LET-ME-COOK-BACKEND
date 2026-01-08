"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comments_service_1 = require("../../services/comments.service");
const comments_schema_1 = require("./comments.schema");
class CommentController {
    static async create(req, res, next) {
        try {
            const data = comments_schema_1.createCommentSchema.parse(req.body);
            const comment = await comments_service_1.CommentService.createComment(data);
            res.json(comment);
        }
        catch (error) {
            next(error);
        }
    }
    static async getByPost(req, res, next) {
        try {
            const { postId } = req.params;
            const comments = await comments_service_1.CommentService.getCommentsByPostId(postId);
            res.json(comments);
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = comments_schema_1.updateCommentSchema.parse(req.body);
            const comment = await comments_service_1.CommentService.updateComment(id, data);
            res.json(comment);
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await comments_service_1.CommentService.deleteComment(id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CommentController = CommentController;
//# sourceMappingURL=comments.controller.js.map