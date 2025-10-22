/**
 * @swagger
 * /api/users:
 *    get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No users found
 *    post:
 *     summary: Create a new user
 *     description: Create a new user with email, password, or Google auth.
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *         schema:
 *           type: object
 *         properties:
 *          name:
 *           type: string
 *           example: John Doe
 *          email:
 *           type: string
 *           example: jhon@example.com
 *          password:
 *           type: string
 *    responses:
 *      201:
 *       description: User created successfully
 *      400:
 *       description: Bad request
 *      401:
 *       description: Unauthorized
 *      409:
 *       description: User already exists
 *
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update user details by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update.
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

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
