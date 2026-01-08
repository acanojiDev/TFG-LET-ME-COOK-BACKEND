"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = exports.followUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username debe tener al menos 3 caracteres'),
    email: zod_1.z.email('Email inválido'),
    password_hash: zod_1.z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
    photo_url: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    birth_date: zod_1.z.date(),
    location: zod_1.z.string().optional(),
});
exports.updateUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).optional(),
    email: zod_1.z.email().optional(),
    password_hash: zod_1.z.string().min(6).optional(),
    photo_url: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    birth_date: zod_1.z.date(),
    location: zod_1.z.string().optional(),
});
exports.followUserSchema = zod_1.z.object({
    followed_id: zod_1.z.string().uuid({ message: "Followed ID must be a valid UUID" }),
});
exports.updateSettingsSchema = zod_1.z.object({
    is_private: zod_1.z.boolean().optional(),
    language: zod_1.z.string().optional(),
    notify_likes: zod_1.z.boolean().optional(),
    notify_comments: zod_1.z.boolean().optional(),
    notify_follows: zod_1.z.boolean().optional(),
    theme: zod_1.z.string().optional(),
});
//# sourceMappingURL=user.schema.js.map