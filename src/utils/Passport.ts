import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

import bcrypt from "bcrypt";
import { User } from "../models/user.model";

interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

//local strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (
      email: string,
      password: string,
      done: (error: any, user?: Express.User | false, options?: { message: string }) => void
    ) => {
      try {
        //find user by email
        const user = await User.findOne({ email });
        if (!user || !user.password) {
          return done(null, false, { message: "User not found or invalid" });
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const safeUser: Express.User = {
          userId: user.id, // mongoose virtual id (string)
          role: user.role as "user" | "admin",
        };

        return done(null, safeUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: Express.User | false, options?: { message?: string }) => void
    ) => {
      try {
        let userDoc = await User.findOne({ googleId: profile.id });

        if (!userDoc) {
          userDoc = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
          });
          await userDoc.save();
        }

        const safeUser: Express.User = {
          userId: userDoc._id!.toString(),
          role: userDoc.role as "user" | "admin",
        };

        return done(null, safeUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//jwt strategy verify token and protected routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (
      payload: JwtPayload,
      done: (error: any, user?: Express.User | false, options?: { message?: string }) => void
    ) => {
      console.log("JWT payload:", payload);
      try {
        // FIX: Use payload.userId instead of the entire payload
        const user = await User.findById(payload.id);
        console.log("user", user);
        if (!user) {
          return done(null, false);
        }

        const safeUser: Express.User = {
          userId: user._id!.toString(),
          role: user.role as "user" | "admin",
        };
        return done(null, safeUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
export default passport;
