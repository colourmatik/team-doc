import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertMembershipFromClerk = internalMutation({
  args: { data: v.any() },
  async handler(ctx, { data }) {
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", data.id))
      .unique();

    const attributes = {
      clerkId: data.id,
      organizationId: data.organization.id,
      userId: data.public_user_data.user_id,
      userEmail: data.public_user_data.identifier,
      role: data.role,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    if (!membership) {
      await ctx.db.insert("memberships", attributes);
    } else {
      await ctx.db.patch(membership._id, attributes);
    }
  },
});

export const deleteMembershipFromClerk = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, { clerkId }) {
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (membership) {
      await ctx.db.delete(membership._id);
    }
  },
});