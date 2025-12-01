import { Request, Response } from 'express';
import { createPostSchema, updatePostSchema } from './post.schema';
import { PostService } from './post.service';

export class PostController {
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

			/// el created_at del último post | undefined
			const cursor = req.query.cursor as string | undefined;

			const limitParsed =  Math.min((limit ? parseInt(limit) : 5), 15)/// pongo como máximo 15 posts a entregar.			

			const allPosts = await PostService.getFeedPosts(limitParsed, cursor);
			
			const hasMore = allPosts.length > limitParsed; /// en caso de haber suficientes, se trae 6 o limit + 1
			const posts = hasMore? allPosts.slice(0, limitParsed): allPosts;

			/// Se coge el último id de post, o ninguno
			const nextCursor = posts.length > 0 ? posts[posts.length - 1].created_at: null 

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
			const post = await PostService.getPostById(id);

			if (!post) {
				return res.status(404).json({ error: 'Publicación no encontrada' });
			}

			res.status(200).json({ data: post });
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

