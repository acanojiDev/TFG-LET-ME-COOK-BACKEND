import prisma from '../../config/database';
import { CreatePostInput, UpdatePostInput } from './post.schema';

const postInclude = {
	user: {
		select: {
			id: true,
			username: true,
			photo_url: true,
		},
	},
};

export class PostService {
	static async createPost(data: CreatePostInput) {
		return prisma.posts.create({
			data,
			include: postInclude,
		});
	}

	static async getAllPosts(limit: number, offset: number) {
		return prisma.posts.findMany({
			take: limit,
			skip: offset,
			orderBy: { created_at: 'desc' },
			include: postInclude,
			
		});
	}

	static async getPostById(id: string) {
		return prisma.posts.findUnique({
			where: { id },
			include: postInclude,
		});
	}

	static async updatePost(id: string, data: UpdatePostInput) {
		return prisma.posts.update({
			where: { id },
			data,
			include: postInclude,
		});
	}

	static async deletePost(id: string) {
		return prisma.posts.delete({
			where: { id },
		});
	}
}

