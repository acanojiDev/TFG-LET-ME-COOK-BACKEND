import { prisma } from "../config/database";
import { CreateUserInput,UpdateSettingsInput, UpdateUserInput } from "../modules/users/user.schema";

export class UserService {
	static async followUser(followerId: string, followedId: string) {
		return await prisma.follows.create({
			data: {
				follower_id: followerId,
				followed_id: followedId,
			},
		});
	}

	static async unfollowUser(followerId: string, followedId: string) {
		return await prisma.follows.delete({
			where: {
				follower_id_followed_id: {
					follower_id: followerId,
					followed_id: followedId,
				},
			},
		});
	}

	static async getFollowers(userId: string) {
		return await prisma.follows.findMany({
			where: { followed_id: userId },
			include: {
				users_follows_follower_idTousers: {
					select: {
						id: true,
						username: true,
						photo_url: true,
					},
				},
			},
		});
	}

	static async getFollowing(userId: string) {
		return await prisma.follows.findMany({
			where: { follower_id: userId },
			include: {
				users_follows_followed_idTousers: {
					select: {
						id: true,
						username: true,
						photo_url: true,
					},
				},
			},
		});
	}

	static async updateSettings(userId: string, data: UpdateSettingsInput) {
		return await prisma.user_settings.upsert({
			where: { user_id: userId },
			update: data,
			create: {
				user_id: userId,
				...data,
			},
		});
	}

	static async getSettings(userId: string) {
		return await prisma.user_settings.findUnique({
			where: { user_id: userId },
		});
	}

	static async createUser(data: CreateUserInput) {
		return await prisma.users.create({
			data,
		});
	}

	static async getAllUsers() {
		return await prisma.users.findMany({
			select: {
				id: true,
				username: true,
				photo_url: true,
				bio: true,
				location: true,
				registered_at: true,
				birth_date: true,
				updated_at: true,
			},
		});
	}

	static async getUserById(id: string) {
		return await prisma.users.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				photo_url: true,
				bio: true,
				location: true,
				registered_at: true,
				birth_date: true,
				updated_at: true,
			},
		});
	}

	static async updateUser(id: string, data: UpdateUserInput) {
		return await prisma.users.update({
			where: { id },
			data,
			select: {
				id: true,
				username: true,
				photo_url: true,
				bio: true,
				location: true,
				registered_at: true,
				birth_date: true,
				updated_at: true,
			},
		});
	}

	static async deleteUser(id: string) {
		return await prisma.users.delete({
			where: { id },
		});
	}

	/**
	 * Obtener el perfil completo de un usuario
	 * Incluye: posts, número de posts, seguidores, seguidos
	 */
	static async getUserProfile(userId: string) {
		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				photo_url: true,
				bio: true,
				location: true,
				_count: {
					select: {
						posts: true,
						follows_follows_followed_idTousers: true, // Seguidores (quienes me siguen)
						follows_follows_follower_idTousers: true,  // Siguiendo (a quienes sigo)
					}
				}
			}
		});

		if (!user) {
			return null;
		}

		return {
			...user,
			postsCount: user._count.posts,
			followersCount: user._count.follows_follows_followed_idTousers,
			followingCount: user._count.follows_follows_follower_idTousers,
		};
	}
}
