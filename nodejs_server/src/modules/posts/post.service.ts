import { prisma } from '../../config/database';
import { CreatePostInput, UpdatePostInput } from './post.schema';

const postInclude = {
	users: {
		select: {
			id: true,
			username: true,
			photo_url: true,
		},
	},
	/// Solo devuelve el numero de likes y comentarios.
	_count: {
		select: {
			comments: true,
			likes: true,
		}
	}
};

export class PostService {
	static async savePost(userId: string, postId: string) {
		return await prisma.user_saved_posts.create({
			data: {
				user_id: userId,
				post_id: postId,
			},
		});
	}

	static async unsavePost(userId: string, postId: string) {
		return await prisma.user_saved_posts.delete({
			where: {
				user_id_post_id: {
					user_id: userId,
					post_id: postId,
				},
			},
		});
	}

	static async getSavedPosts(userId: string) {
		return await prisma.user_saved_posts.findMany({
			where: { user_id: userId },
			include: {
				posts: {
					include: {
						users: {
							select: {
								id: true,
								username: true,
								photo_url: true,
							},
						},
						_count: {
							select: {
								comments: true,
								likes: true,
							},
						},
					},
				},
			},
		});
	}

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
	 * @param user_id 	ID del usuario para filtrar posts ya vistos
	 * @param cursor   created_at del último post que recibió el usuario
	 * @returns
	 */

	static async getFeedPosts(limit: number, user_id: string, cursor?: string) {
		return prisma.posts.findMany({
			take: limit + 1,
			orderBy: { created_at: 'desc' },
			where: {
				...(cursor && {
					created_at: {
						lt: new Date(cursor), // menor que el cursor
					},
				}),
				// Excluir posts creados por el mismo usuario
				user_id: {
					not: user_id
				},
				// Excluir posts que el usuario ya ha visto
				NOT: {
					user_viewed_posts: {
						some: {
							user_id: user_id
						}
					}
				}
			},
			include: postInclude
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

	static async getUserPosts(targetUserId: string) {
		return prisma.posts.findMany({
			where: { user_id: targetUserId },
			orderBy: { created_at: 'desc' },
			include: postInclude
		});
	}
}

