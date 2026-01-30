import { prisma } from '../config/database';
import { CreateLikeInput } from '../modules/likes/likes.schema';

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
				post_id: post_id
			}
		});
	}

	static async getAllLikesOfAUser(user_id: string) {
		return prisma.likes.findMany({
			where: {
				user_id: user_id
			}
		});
	}

	static async deleteLike(user_id: string, post_id: string) {
		return prisma.likes.deleteMany({
			where: {
				post_id: post_id,
				user_id: user_id
			}
		});
	}

	static async getLike(user_id: string, post_id: string){
     return prisma.likes.findUnique({
			where: {
        user_id_post_id: {
					user_id: user_id,
					post_id: post_id
				}
			}
		})
	}
}

