"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
type OrganizationClaims = {
    id: string;
    slg?: string;
    rol?: string;
    per?: string;
    fpm?: string;
  };

export async function getUsers() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();
  const orgClaims = sessionClaims?.o as OrganizationClaims;

  const response = await clerk.users.getUserList({
    organizationId: [orgClaims.id as string],
  });

  const users = response.data.map((user) => ({
    id: user.id,
    name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
    avatar: user.imageUrl,
    color: "",
  }));

  return users;
}