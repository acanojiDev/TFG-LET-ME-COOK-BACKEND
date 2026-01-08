"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controller_1 = require("./comments.controller");
const router = (0, express_1.Router)();
router.post("/", comments_controller_1.CommentController.create);
router.get("/post/:postId", comments_controller_1.CommentController.getByPost);
router.patch("/:id", comments_controller_1.CommentController.update);
router.delete("/:id", comments_controller_1.CommentController.delete);
exports.default = router;
//# sourceMappingURL=comments.routes.js.map