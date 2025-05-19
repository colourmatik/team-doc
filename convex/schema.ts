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
    // Уникальный идентификатор пользователя из Clerk (user.id или user.subject)
    clerkId: v.string(),
    // Имя пользователя (fullName или email)
    name: v.string(),
    // URL аватара пользователя
    avatar: v.optional(v.string()),
    // Цвет, связанный с пользователем (для UI, например, hsl)
    color: v.optional(v.string()),
    // Идентификатор организации (если пользователь состоит в организации)
    organizationId: v.optional(v.string()),
    // Название организации (для отображения)
    organizationName: v.optional(v.string()),
    // Роль в организации (например, admin, member), если применимо
    organizationRole: v.optional(v.string()),
    // Время создания записи
    createdAt: v.number(),
    // Время последнего обновления
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"]) // Индекс для быстрого поиска по clerkId
    .index("by_organizationId", ["organizationId"]) // Индекс для поиска пользователей по организации
    .searchIndex("search_name", {
      searchField: "name", // Поиск по имени пользователя
      filterFields: ["organizationId", "clerkId"],
    }),
    organizations: defineTable({
  clerkId: v.string(),
  name: v.string(),
  slug: v.string(),
  logo: v.optional(v.string()),
  image: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_clerkId", ["clerkId"]),

memberships: defineTable({
  clerkId: v.string(),
  organizationId: v.string(),
  userId: v.string(),
  role: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_clerkId", ["clerkId"]),

  });