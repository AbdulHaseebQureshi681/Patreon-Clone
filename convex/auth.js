import { nextAuth } from "@convex-dev/auth/providers/next-auth";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    nextAuth({
      domain: process.env.NEXTAUTH_URL,
    }),
  ],
});
