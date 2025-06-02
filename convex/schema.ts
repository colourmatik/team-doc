import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        initialContent: v.optional(v.string()),
        ownerId: v.string(),
        ownerName: v.string(),
        roomId: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        organizationName: v.optional(v.string()),
    })
        .index("by_owner_id", ["ownerId"])
        .index("by_organization_id", ["organizationId"])
        .searchIndex("search_title",  {
            searchField:"title",
            filterFields: ["ownerId", "organizationId"],
        }),

    users: defineTable({
        clerkId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        username: v.string(),
        avatar: v.optional(v.string()),
        color: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
  })
        .index("by_clerkId", ["clerkId"]) 
        .searchIndex("search_name", {
          searchField: "username",
          filterFields: [ "clerkId"],
        }),
    organizations: defineTable({
        clerkId: v.string(),
        name: v.string(),
        slug: v.string(),
        logo: v.optional(v.string()),
        image: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clerkId", ["clerkId"]),

    memberships: defineTable({
        clerkId: v.string(),
        organizationId: v.string(),
        userId: v.string(),
        userEmail: v.string(),
        role: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
     })
        .index("by_clerkId", ["clerkId"]),
});