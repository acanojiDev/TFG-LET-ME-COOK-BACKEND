import { Request, Response, NextFunction } from "express";
import { GroupService } from "./groups.service";
import { createGroupSchema, addUserToGroupSchema } from "./groups.schema";

export class GroupController {
	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = createGroupSchema.parse(req.body);
			const group = await GroupService.createGroup(data);
			res.json(group);
		} catch (error) {
			next(error);
		}
	}

	static async get(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const group = await GroupService.getGroupById(id);
			if (!group) {
				return res.status(404).json({ message: "Group not found" });
			}
			res.json(group);
		} catch (error) {
			next(error);
		}
	}

	static async addUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { user_id } = addUserToGroupSchema.parse(req.body);
			await GroupService.addUserToGroup(id, user_id);
			res.status(200).json({ message: "User added to group" });
		} catch (error) {
			next(error);
		}
	}

	static async removeUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, userId } = req.params;
			await GroupService.removeUserFromGroup(id, userId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await GroupService.deleteGroup(id);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}
