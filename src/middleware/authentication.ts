import type { Middleware } from "koa";

import passport from "@/modules/passport.module";
import { ValidationError } from "@/exceptions";
import { UNAUTHENTICATED_ERROR } from "@/errors/auth.errors";

export default function (): Middleware {
  return async (ctx, next) => {
    // ignore auth routes, user is sobviously not authenticated
    if (ctx.request.url.includes("/auth")) {
      return await next();
    }

    await passport.authenticate("jwt", { session: false }, (err, user) => {
      if (!user) {
        throw new ValidationError(UNAUTHENTICATED_ERROR);
      }

      ctx.user = user;

      next();
    })(ctx, next);
  };
}
