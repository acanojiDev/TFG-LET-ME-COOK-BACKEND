import { Request, Response } from 'express';
import { createLikeSchema } from './likes.schema';
import { LikeService } from './likes.service';

export class LikesController {
	static async createLike(req: Request, res: Response) {
		try {
			const validatedData = createLikeSchema.parse(req.body);
			const like = await LikeService.createLike(validatedData);

			res.status(201).json({
				message: 'Añadido like para la publicación: ' + like.post_id,
				data: like,
			});
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	/// Recoge todos los likes de un post
	static async getAllLikesOfAPost(req: Request, res: Response) {
		try {
			const { postId } = req.params;

			// Validar que postId sea un UUID válido
			const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
			if (!uuidRegex.test(postId)) {
				return res.status(400).json({
					error: 'El postId debe ser un UUID válido'
				});
			}
			
			const likes = await LikeService.getAllLikesOfAPost(postId);
			res.status(200).json({ data: likes });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	/// Recoge todos los likes de un user
	static async getAllLikesOfAUser(req: Request, res: Response) {
		try {
			const { userId } = req.params;

			// Validar que userId sea un UUID válido
			const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
			if (!uuidRegex.test(userId)) {
				return res.status(400).json({
					error: 'El userId debe ser un UUID válido'
				});
			}

			const likes = await LikeService.getAllLikesOfAUser(userId);
			res.status(200).json({ data: likes });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	static async deleteLike(req: Request, res: Response) {
		try {
			const { userId, postId } = req.params;

			// Validar que userId y postId sean UUIDs válidos
			const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
			if (!uuidRegex.test(userId)) {
				return res.status(400).json({
					error: 'El userId debe ser un UUID válido'
				});
			}
			if (!uuidRegex.test(postId)) {
				return res.status(400).json({
					error: 'El postId debe ser un UUID válido'
				});
			}

			await LikeService.deleteLike(userId, postId);

			res.status(200).json({ message: 'Publicación eliminada exitosamente' });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}
