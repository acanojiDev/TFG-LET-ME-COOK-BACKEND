import { Request, Response } from 'express';
import { createPostSchema, updatePostSchema } from './post.schema';
import { PostService } from './post.service';
import { UserService } from '../users/user.service';
import { LikesController } from '../likes/likes.controller';

export class PostController {
	static async save(req: Request, res: Response) {
		try {
			const { id } = req.params; // user_id
			const { post_id } = req.body; // Assuming post_id is passed in body as per previous incomplete edit or extracting from schema if imported
			// Actually let's just take it from body directly or use schema if available.
			// checking imports... 'savePostSchema' not imported.
			// I'll import it.
			await PostService.savePost(id, post_id);
			res.status(200).json({ message: "Post saved" });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	static async unsave(req: Request, res: Response) {
		try {
			const { id, postId } = req.params;
			await PostService.unsavePost(id, postId);
			res.status(200).json({ message: "Post unsaved" });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getSaved(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const savedPosts = await PostService.getSavedPosts(id);

			const data = await Promise.all(savedPosts.map(async (saved: any) => {
				const post = saved.posts;
				const is_liked = await LikesController.userHasLikedPost(id, post.id);
				return {
					...post,
					is_liked
				};
			}));

			res.status(200).json({ data });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	static async createPost(req: Request, res: Response) {
		try {
			const validatedData = createPostSchema.parse(req.body);
			const post = await PostService.createPost(validatedData);

			res.status(201).json({
				message: 'Publicación creada exitosamente',
				data: post,
			});
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	static async getPosts(req: Request, res: Response) {
		try {
			const limit = req.query.limit as string | undefined;
			const user_id = req.query.user_id as string | undefined;

			/// el created_at del ultimo post | undefined
			const cursor = req.query.cursor as string | undefined;

			// Validar que user_id este presente
			if (!user_id) {
				return res.status(400).json({
					error: 'El parámetro user_id es requerido'
				});
			}

			// Validar formato UUID básico
			const user = await UserService.getUserById(user_id)
			if (!user) {
				return res.status(400).json({
					error: 'El usuario no existe'
				});
			}

			const limitParsed = Math.min((limit ? parseInt(limit) : 5), 15)/// pongo como máximo 15 posts a entregar.

			const allPosts = await PostService.getFeedPosts(limitParsed, user_id, cursor);

			const hasMore = allPosts.length > limitParsed; /// en caso de haber suficientes, se trae 6 o limit + 1
			const rawPosts = hasMore ? allPosts.slice(0, limitParsed) : allPosts;

			const posts = await Promise.all(rawPosts.map(async (post: any) => {
				const is_liked = await LikesController.userHasLikedPost(user_id, post.id);
				return {
					...post,
					is_liked
				};
			}));

			/// Se coge el último id de post, o ninguno
			const nextCursor = posts.length > 0 ? posts[posts.length - 1].created_at : null

			res.status(200).json({
				data: posts,
				next_cursor: nextCursor,
				has_more: hasMore
			});
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	static async getPostById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const user_id = req.query.user_id as string | undefined;

			const post = await PostService.getPostById(id);

			if (!post) {
				return res.status(404).json({ error: 'Publicación no encontrada' });
			}

			let is_liked = false;
			if (user_id) {
				is_liked = await LikesController.userHasLikedPost(user_id, id);
			}

			res.status(200).json({
				data: {
					...post,
					is_liked
				}
			});
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	static async updatePost(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const validatedData = updatePostSchema.parse(req.body);
			const post = await PostService.updatePost(id, validatedData);

			res.status(200).json({
				message: 'Publicación actualizada exitosamente',
				data: post,
			});
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	static async deletePost(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await PostService.deletePost(id);

			res.status(200).json({ message: 'Publicación eliminada exitosamente' });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}

