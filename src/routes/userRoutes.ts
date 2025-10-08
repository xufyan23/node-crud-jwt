import { Router } from "express";
import {
  getUsers,
  createUser,
  updatedUser,
  deletedUser,
} from "../controllers/usersController";
import { validate } from "../middlewares/Validate";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

import passport from "passport";
import { authorize } from "../middlewares/authorizeHandler";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), getUsers);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(createUserSchema),
  createUser
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(updateUserSchema),
  updatedUser
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorize(["admin"]),
  deletedUser
);

export default router;
