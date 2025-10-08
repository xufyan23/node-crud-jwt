import { Router } from "express";
import { register, login, refreshToken, googleCallback } from "../controllers/authController";
import passport from "passport";

const router = Router();

router.post("/register", register);

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
router.post("/refresh", refreshToken);

export default router;
