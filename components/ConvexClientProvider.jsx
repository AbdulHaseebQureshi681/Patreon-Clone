"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useSession } from "next-auth/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  const { data: session, status } = useSession();

  return (
    <ConvexProvider client={convex} authInfo={session || null}>
      {children}
    </ConvexProvider>
  );
}
