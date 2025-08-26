import { query } from "@/convex/_generated/server";

export const list = query(async ({ db }) => {
  return await db.query("messages").collect();
});
import { mutation } from "@/convex/_generated/server";

export const send = mutation(async ({ db }, { text, user }) => {
  await db.insert("messages", {
    text,
    userEmail: user.email,
    userName: user.name,
    userImage: user.image,
    createdAt: Date.now(),
  });
});
