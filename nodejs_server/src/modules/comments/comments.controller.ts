import { Request, Response, NextFunction } from "express";
import { CommentService } from "./comments.service";
import { createCommentSchema, updateCommentSchema } from "./comments.schema";

export class CommentController {
	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = createCommentSchema.parse(req.body);
			const comment = await CommentService.createComment(data);
			res.json(comment);
		} catch (error) {
			next(error);
		}
	}

	static async getByPost(req: Request, res: Response, next: NextFunction) {
		try {
			const { postId } = req.params;
			const comments = await CommentService.getCommentsByPostId(postId);
			res.json(comments);
		} catch (error) {
			next(error);
		}
	}

	static async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const data = updateCommentSchema.parse(req.body);
			const comment = await CommentService.updateComment(id, data);
			res.json(comment);
		} catch (error) {
			next(error);
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await CommentService.deleteComment(id);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}
