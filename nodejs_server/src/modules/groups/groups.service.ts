import { prisma } from "../../config/database";
import { CreateGroupInput } from "./groups.schema";

export class GroupService {
	static async createGroup(data: CreateGroupInput) {
		return await prisma.groups.create({
			data,
		});
	}

	static async getGroupById(id: string) {
		return await prisma.groups.findUnique({
			where: { id },
			include: {
				group_users: {
					include: {
						users: {
							select: {
								id: true,
								username: true,
								photo_url: true,
							},
						},
					},
				},
			},
		});
	}

	static async addUserToGroup(groupId: string, userId: string) {
		return await prisma.group_users.create({
			data: {
				group_id: groupId,
				user_id: userId,
			},
		});
	}

	static async removeUserFromGroup(groupId: string, userId: string) {
		return await prisma.group_users.delete({
			where: {
				group_id_user_id: {
					group_id: groupId,
					user_id: userId,
				},
			},
		});
	}

	static async deleteGroup(id: string) {
		return await prisma.groups.delete({
			where: { id },
		});
	}
}
