/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with name, email, password, or Google Auth.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (e.g., user already exists)
 *       500:
 *         description: Internal server error
 *
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       500:
 *         description: Internal server error
 *
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     description: Redirects to Google for authentication.
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 *
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Callback URL for Google OAuth.
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Unauthorized (authentication failed)
 *
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     description: Refresh the JWT token using a refresh token.
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized (invalid refresh token)
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  googleCallback,
} from "../controllers/authController";
import passport from "passport";

const router = Router();

router.post("/register", register);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
router.post("/refresh", refreshToken);

export default router;
