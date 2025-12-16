import { Router } from "express";
import { GroupController } from "./groups.controller";

const router = Router();

router.post("/", GroupController.create);
router.get("/:id", GroupController.get);
router.post("/:id/users", GroupController.addUser);
router.delete("/:id/users/:userId", GroupController.removeUser);
router.delete("/:id", GroupController.delete);

export default router;
