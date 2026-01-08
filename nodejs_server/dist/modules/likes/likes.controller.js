"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesController = void 0;
const likes_schema_1 = require("./likes.schema");
const likes_service_1 = require("../../services/likes.service");
const post_service_1 = require("../../services/post.service");
const user_service_1 = require("../../services/user.service");
class LikesController {
    /// Crear like
    static async createLike(req, res) {
        try {
            const validatedData = likes_schema_1.createLikeSchema.parse(req.body);
            const likeExistente = await likes_service_1.LikeService.getLike(validatedData.user_id, validatedData.post_id);
            if (likeExistente) {
                return res.status(200).json({ message: "El like ya existia." });
            }
            const like = await likes_service_1.LikeService.createLike(validatedData);
            return res.status(201).json({
                message: "Añadido like para la publicación: " + like.post_id,
                data: like,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    /// Recoge todos los likes de un post
    static async getAllLikesOfAPost(req, res) {
        try {
            const { postId } = req.params;
            // Validar que postId sea un UUID válido
            const post = post_service_1.PostService.getPostById(postId);
            if (!post) {
                return res.status(400).json({
                    error: "No existe el post",
                });
            }
            const likes = await likes_service_1.LikeService.getAllLikesOfAPost(postId);
            return res.status(200).json({ data: likes });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    /// Recoge todos los likes de un user
    static async getAllLikesOfAUser(req, res) {
        try {
            const { userId } = req.params;
            // Validar que userId sea un UUID válido
            const user = user_service_1.UserService.getUserById(userId);
            if (!user) {
                return res.status(400).json({
                    error: "El usuario no existe",
                });
            }
            const likes = await likes_service_1.LikeService.getAllLikesOfAUser(userId);
            return res.status(200).json({ data: likes });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async deleteLike(req, res) {
        try {
            const { userId, postId } = req.params;
            // Validar que userId y postId sean UUIDs válidos
            const user = user_service_1.UserService.getUserById(userId);
            const likeExistente = await likes_service_1.LikeService.getLike(userId, postId);
            if (!likeExistente) {
                return res.status(200).json({ message: "El like ya no existia." });
            }
            await likes_service_1.LikeService.deleteLike(userId, postId);
            return res.status(200).json({ message: "Like eliminado exitosamente" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async userHasLikedPost(userId, postId) {
        const like = await likes_service_1.LikeService.getLike(userId, postId);
        return !!like;
    }
}
exports.LikesController = LikesController;
//# sourceMappingURL=likes.controller.js.map