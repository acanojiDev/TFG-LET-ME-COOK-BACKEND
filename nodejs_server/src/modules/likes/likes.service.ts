import prisma from '../../config/database';
import { CreateLikeInput } from './likes.schema';

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

export class LikeService {
	static async createLike(data: CreateLikeInput) {
		return prisma.likes.create({
			data,
		});
	}

	static async getAllLikesOfAPost(post_id: string) {
		return prisma.likes.findMany({
			where: {
				postId: post_id
			}
		});
	}

	static async getAllLikesOfAUser(user_id: string) {
		return prisma.likes.findMany({
			where: {
				userId: user_id
			}
		});
	}

	static async deleteLike(user_id: string, post_id: string) {
		return prisma.likes.deleteMany({
			where: {
				postId: post_id,
				userId: user_id
			}
		});
	}
}

