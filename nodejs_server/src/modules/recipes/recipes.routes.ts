import { Router } from "express";
import { RecipeController } from "./recipes.controller";

const router = Router();

router.post("/", RecipeController.create);
router.get("/:id", RecipeController.get);
router.patch("/:id", RecipeController.update);
router.delete("/:id", RecipeController.delete);

export default router;
