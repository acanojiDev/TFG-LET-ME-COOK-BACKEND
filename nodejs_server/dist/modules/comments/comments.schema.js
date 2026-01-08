"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    post_id: zod_1.z.string().uuid({ message: "Post ID must be a valid UUID" }),
    user_id: zod_1.z.string().uuid({ message: "User ID must be a valid UUID" }),
    text: zod_1.z.string().min(1, { message: "Comment text cannot be empty" }),
});
exports.updateCommentSchema = zod_1.z.object({
    text: zod_1.z.string().min(1, { message: "Comment text cannot be empty" }),
});
//# sourceMappingURL=comments.schema.js.map