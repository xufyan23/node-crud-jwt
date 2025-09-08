import { Router } from "express";
import {
  getUsers,
  createUser,
  updatedUser,
  deletedUser,
} from "../controllers/usersController";
import { validate } from "../middlewares/Validate";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { protect } from "../middlewares/authHandler";

const router = Router();

router.get("/", protect, getUsers);
router.post("/", protect, validate(createUserSchema), createUser);
router.put("/:id", protect, validate(updateUserSchema), updatedUser);
router.delete("/:id", protect, deletedUser);

export default router;
