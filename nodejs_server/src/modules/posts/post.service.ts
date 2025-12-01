import { prisma } from '../../config/database';
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
			data
		});
	}

	/**
	 * Buscamos por limite + 1 para comporbar si quedan mas posts.
	 *
	 *
	 * Se usa el spread para comprobar si existe el cursor o no
	 * Si existe cursor, se añade a la query,
	 * y además skipeamos uno, que sería el último de la anterior query
	 *
	 * @param limit 	número de posts a entregar ( si hay )
	 * @param cursor   ID del último post que recibió el usuario
	 * @returns
	 */

	static async getFeedPosts(limit: number, cursor: string | undefined) {
		return prisma.posts.findMany({
			take: limit + 1,
			...(cursor && {
				cursor: { id: cursor},
				skip: 1
			}),
			orderBy: { created_at: 'desc' }
		});
	}

	static async getPostById(id: string) {
		return prisma.posts.findUnique({
			where: { id }
		});
	}

	static async updatePost(id: string, data: UpdatePostInput) {
		return prisma.posts.update({
			where: { id },
			data
		});
	}

	static async deletePost(id: string) {
		return prisma.posts.delete({
			where: { id },
		});
	}
}

