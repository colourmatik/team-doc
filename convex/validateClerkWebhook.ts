import { Webhook } from "svix";

const signingSecret = process.env.CLERK_SIGNING_SECRET!;

interface ClerkWebhookPayload {
  type: string;
  data: {
    id: string;
    [key: string]: unknown;
  };
}

export async function validateRequest(request: Request): Promise<ClerkWebhookPayload | null> {
  const payload = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  try {
    const wh = new Webhook(signingSecret);
    return wh.verify(payload, headers) as ClerkWebhookPayload;
  } catch (err) {
    console.error("Webhook validation failed:", err);
    return null;
  }
}