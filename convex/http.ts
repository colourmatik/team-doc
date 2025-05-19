import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error occurred", { status: 400 });
    }

    const { type, data } = event;

    switch (type) {
      // === Users ===
      case "user.created":
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, { data });
        break;

      case "user.deleted":
        await ctx.runMutation(internal.users.deleteFromClerk, {
          clerkUserId: data.id!,
        });
        break;

      // === Organizations ===
      case "organization.created":
      case "organization.updated":
        await ctx.runMutation(internal.organizations.upsertOrganizationFromClerk, { data });
        break;

      case "organization.deleted":
        await ctx.runMutation(internal.organizations.deleteOrganizationFromClerk, {
          clerkId: data.id!,
        });
        break;

      // === Memberships ===
      case "organizationMembership.created":
      case "organizationMembership.updated":
        await ctx.runMutation(internal.memberships.upsertMembershipFromClerk, { data });
        break;

      case "organizationMembership.deleted":
        await ctx.runMutation(internal.memberships.deleteMembershipFromClerk, {
          clerkId: data.id,
        });
        break;

      default:
        console.log("Ignored Clerk webhook event:", type);
    }

    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
