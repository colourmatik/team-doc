import { mutation } from "./_generated/server";

export const updateOrCreateUser = mutation(async ({ db }, { clerkUser }) => {
  await db
    .table("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", clerkUser.id))
    .upsert({
      clerkUser,
    });
});

export const deleteUser = mutation(async ({ db }, { id }) => {
  await db
    .table("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", id))
    .delete();
});
