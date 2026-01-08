"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePostSchema = exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid({ message: "User ID must be a valid UUID" }),
    type: zod_1.z.string().min(1, { message: "Type is required" }),
    content: zod_1.z.string().optional(),
    media_url: zod_1.z.string().optional(),
});
exports.updatePostSchema = zod_1.z.object({
    content: zod_1.z.string().optional(),
    media_url: zod_1.z.string().optional(),
});
exports.savePostSchema = zod_1.z.object({
    post_id: zod_1.z.string().uuid({ message: "Post ID must be a valid UUID" }),
});
//# sourceMappingURL=post.schema.js.map