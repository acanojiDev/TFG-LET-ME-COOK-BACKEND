import { Router } from "express";
import { CommentController } from "./comments.controller";

const router = Router();

router.post("/", CommentController.create);
router.get("/post/:postId", CommentController.getByPost);
router.patch("/:id", CommentController.update);
router.delete("/:id", CommentController.delete);

export default router;
