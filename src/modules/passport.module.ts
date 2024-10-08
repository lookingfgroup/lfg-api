import passport from "koa-passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import { getUser } from "@/db/user.db";
import { LfgError } from "@/exceptions";
import { UNAUTHENTICATED_ERROR } from "@/errors/auth.errors";
import { logError } from "@/services/sentry";

passport.serializeUser((user, done) => {
  try {
    done(null, JSON.stringify(user));
  } catch (err) {
    logError(err);
    done(err);
  }
});

passport.deserializeUser((user: string, done) => {
  try {
    done(null, JSON.parse(user));
  } catch (err) {
    logError(err);
    done(err);
  }
});

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
      audience: ["lfgapp"],
      issuer: "lfgapp",
    },
    async function (jwt, done) {
      try {
        const user = await getUser(jwt.id);

        if (!user) {
          return done(UNAUTHENTICATED_ERROR, false);
        }

        done(null, user);
      } catch (err: any) {
        throw new LfgError("[passport.module]: failed to validate auth", err);
      }
    },
  ),
);

export default passport;
