import { prisma } from "../../config/database";
import { CreateCommentInput, UpdateCommentInput } from "./comments.schema";

export class CommentService {
	static async createComment(data: CreateCommentInput) {
		return await prisma.comments.create({
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

	static async getCommentsByPostId(post_id: string) {
		return await prisma.comments.findMany({
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

	static async updateComment(id: string, data: UpdateCommentInput) {
		return await prisma.comments.update({
			where: { id },
			data,
		});
	}

	static async deleteComment(id: string) {
		return await prisma.comments.delete({
			where: { id },
		});
	}
}
