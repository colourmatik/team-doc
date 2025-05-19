import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertOrganizationFromClerk = internalMutation({
  args: {
    data: v.any(),
  },
  async handler(ctx, { data }) {
    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", data.id))
      .unique();

    const orgAttributes = {
      clerkId: data.id,
      name: data.name,
      slug: data.slug,
      logo: data.logo_url ?? null,
      image: data.image_url ?? null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    if (organization === null) {
      await ctx.db.insert("organizations", orgAttributes);
    } else {
      await ctx.db.patch(organization._id, orgAttributes);
    }
  },
});

export const deleteOrganizationFromClerk = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, { clerkId }) {
    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (organization) {
      await ctx.db.delete(organization._id);
    }
  },
});
