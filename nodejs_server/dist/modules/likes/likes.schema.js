"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLikeSchema = void 0;
const zod_1 = require("zod");
exports.createLikeSchema = zod_1.z.object({
    user_id: zod_1.z.uuid('user not found'),
    post_id: zod_1.z.uuid('post not found'),
});
//# sourceMappingURL=likes.schema.js.map