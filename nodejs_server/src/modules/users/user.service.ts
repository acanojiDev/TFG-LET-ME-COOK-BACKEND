import prisma from "../../config/database";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

export class UserService {
	static async createUser(data: CreateUserInput) {
		return await prisma.users.create({
			data,
		});
	}

	static async getAllUsers() {
		return await prisma.users.findMany({
			select: {
				id:true,
				username: true,
				email: true,
				photo_url: true,
				bio: true,
				location: true,
				registered_at: true,
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
				email: true,
				photo_url: true,
				bio: true,
				location: true,
				registered_at: true,
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
				email: true,
				photo_url: true,
				bio: true,
				location: true,
				registered_at: true,
				updated_at: true,
			},
		});
	}

	static async deleteUser(id: string) {
		return await prisma.users.delete({
			where: { id },
		});
	}
}
