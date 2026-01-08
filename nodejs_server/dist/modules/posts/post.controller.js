"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const post_schema_1 = require("./post.schema");
const post_service_1 = require("../../services/post.service");
const user_service_1 = require("../../services/user.service");
const likes_controller_1 = require("../likes/likes.controller");
class PostController {
    static async save(req, res) {
        try {
            const { id } = req.params; // user_id
            const { post_id } = req.body; // Assuming post_id is passed in body as per previous incomplete edit or extracting from schema if imported
            // Actually let's just take it from body directly or use schema if available.
            // checking imports... 'savePostSchema' not imported.
            // I'll import it.
            await post_service_1.PostService.savePost(id, post_id);
            res.status(200).json({ message: "Post saved" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async unsave(req, res) {
        try {
            const { id, postId } = req.params;
            await post_service_1.PostService.unsavePost(id, postId);
            res.status(200).json({ message: "Post unsaved" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getSaved(req, res) {
        try {
            const { id } = req.params;
            const savedPosts = await post_service_1.PostService.getSavedPosts(id);
            const data = await Promise.all(savedPosts.map(async (saved) => {
                const post = saved.posts;
                const is_liked = await likes_controller_1.LikesController.userHasLikedPost(id, post.id);
                return {
                    ...post,
                    is_liked
                };
            }));
            res.status(200).json({ data });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async createPost(req, res) {
        try {
            const validatedData = post_schema_1.createPostSchema.parse(req.body);
            const post = await post_service_1.PostService.createPost(validatedData);
            res.status(201).json({
                message: 'Publicación creada exitosamente',
                data: post,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getPosts(req, res) {
        try {
            const limit = req.query.limit;
            const user_id = req.query.user_id;
            /// el created_at del ultimo post | undefined
            const cursor = req.query.cursor;
            // Validar que user_id este presente
            if (!user_id) {
                return res.status(400).json({
                    error: 'El parámetro user_id es requerido'
                });
            }
            // Validar formato UUID básico
            const user = await user_service_1.UserService.getUserById(user_id);
            if (!user) {
                return res.status(400).json({
                    error: 'El usuario no existe'
                });
            }
            const limitParsed = Math.min((limit ? parseInt(limit) : 5), 15); /// pongo como máximo 15 posts a entregar.
            const allPosts = await post_service_1.PostService.getFeedPosts(limitParsed, user_id, cursor);
            const hasMore = allPosts.length > limitParsed; /// en caso de haber suficientes, se trae 6 o limit + 1
            const rawPosts = hasMore ? allPosts.slice(0, limitParsed) : allPosts;
            const posts = await Promise.all(rawPosts.map(async (post) => {
                const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
                return {
                    ...post,
                    is_liked
                };
            }));
            /// Se coge el último id de post, o ninguno
            const nextCursor = posts.length > 0 ? posts[posts.length - 1].created_at : null;
            return res.status(200).json({
                data: posts,
                next_cursor: nextCursor,
                has_more: hasMore
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async getPostById(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.query.user_id;
            const post = await post_service_1.PostService.getPostById(id);
            if (!post) {
                return res.status(404).json({ error: 'Publicación no encontrada' });
            }
            let is_liked = false;
            if (user_id) {
                is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, id);
            }
            return res.status(200).json({
                data: {
                    ...post,
                    is_liked
                }
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async updatePost(req, res) {
        try {
            const { id } = req.params;
            const validatedData = post_schema_1.updatePostSchema.parse(req.body);
            const post = await post_service_1.PostService.updatePost(id, validatedData);
            res.status(200).json({
                message: 'Publicación actualizada exitosamente',
                data: post,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deletePost(req, res) {
        try {
            const { id } = req.params;
            await post_service_1.PostService.deletePost(id);
            res.status(200).json({ message: 'Publicación eliminada exitosamente' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getUserPosts(req, res) {
        try {
            const { target_user_id } = req.params;
            const { user_id } = req.query;
            if (!user_id) {
                return res.status(400).json({ error: 'El parámetro user_id es requerido' });
            }
            const targetUser = await user_service_1.UserService.getUserById(target_user_id);
            if (!targetUser) {
                return res.status(404).json({ error: 'El usuario del perfil no existe' });
            }
            const rawPosts = await post_service_1.PostService.getUserPosts(target_user_id);
            const posts = await Promise.all(rawPosts.map(async (post) => {
                const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
                return {
                    ...post,
                    is_liked
                };
            }));
            return res.status(200).json({ data: posts });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map