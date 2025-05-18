import { httpRouter } from "convex/server"; // Use only httpRouter
import { validateRequest } from "./validateClerkWebhook"; // Ensure the file path is correct
import { updateOrCreateUser, deleteUser } from "./users"; // Import specific mutations

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: async (ctx, request) => {
    const event = await validateRequest(request); // Validate the webhook request
    if (!event) {
      return new Response("Invalid webhook request", { status: 400 });
    }

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        await ctx.runMutation(updateOrCreateUser, {
          clerkUser: event.data,
        });
        break;
      }
      case "user.deleted": {
        const id = event.data.id!;
        await ctx.runMutation(deleteUser, { id });
        break;
      }
      default: {
        console.log("Ignored Clerk webhook event:", event.type);
      }
    }

    return new Response(null, { status: 200 });
  },
});

export default http;
