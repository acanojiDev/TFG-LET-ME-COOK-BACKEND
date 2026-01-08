"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likes_controller_1 = require("./likes.controller");
const router = (0, express_1.Router)();
//TODO SWAGGER
router.post('/', likes_controller_1.LikesController.createLike);
//TODO SWAGGER
// Rutas más específicas primero
router.delete('/:userId/:postId', likes_controller_1.LikesController.deleteLike);
//TODO SWAGGER
router.get('/posts/:postId', likes_controller_1.LikesController.getAllLikesOfAPost);
//TODO SWAGGER
router.get('/users/:userId', likes_controller_1.LikesController.getAllLikesOfAUser);
exports.default = router;
//# sourceMappingURL=likes.routes.js.map