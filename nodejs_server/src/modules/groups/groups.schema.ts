import { z } from "zod";

export const createGroupSchema = z.object({
	name: z.string().min(1, { message: "Group name is required" }),
	description: z.string().optional(),
});

export const addUserToGroupSchema = z.object({
	user_id: z.string().uuid({ message: "User ID must be a valid UUID" }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type AddUserToGroupInput = z.infer<typeof addUserToGroupSchema>;
