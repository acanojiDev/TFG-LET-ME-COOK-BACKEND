"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../../services/user.service");
const user_schema_1 = require("./user.schema");
class UserController {
    static async follow(req, res, next) {
        try {
            const { id } = req.params; // follower_id (usually from auth token, but using params for now as requested context implies general access)
            const { followed_id } = user_schema_1.followUserSchema.parse(req.body);
            await user_service_1.UserService.followUser(id, followed_id);
            res.status(200).json({ message: "User followed" });
        }
        catch (error) {
            next(error);
        }
    }
    static async unfollow(req, res, next) {
        try {
            const { id, followedId } = req.params;
            await user_service_1.UserService.unfollowUser(id, followedId);
            res.status(200).json({ message: "User unfollowed" });
        }
        catch (error) {
            next(error);
        }
    }
    static async getFollowers(req, res, next) {
        try {
            const { id } = req.params;
            const followers = await user_service_1.UserService.getFollowers(id);
            res.json(followers);
        }
        catch (error) {
            next(error);
        }
    }
    static async getFollowing(req, res, next) {
        try {
            const { id } = req.params;
            const following = await user_service_1.UserService.getFollowing(id);
            res.json(following);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateSettings(req, res, next) {
        try {
            const { id } = req.params;
            const data = user_schema_1.updateSettingsSchema.parse(req.body);
            const settings = await user_service_1.UserService.updateSettings(id, data);
            res.json(settings);
        }
        catch (error) {
            next(error);
        }
    }
    static async getSettings(req, res, next) {
        try {
            const { id } = req.params;
            const settings = await user_service_1.UserService.getSettings(id);
            res.json(settings);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await user_service_1.UserService.getAllUsers();
            res.status(200).json({ data: users });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await user_service_1.UserService.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            return res.status(200).json({ data: user });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const validatedData = user_schema_1.updateUserSchema.parse(req.body);
            const user = await user_service_1.UserService.updateUser(id, validatedData);
            res.status(200).json({
                message: 'Usuario actualizado exitosamente',
                data: user,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await user_service_1.UserService.deleteUser(id);
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map