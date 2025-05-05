"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {
    const params =useParams();
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_Bl19q8r12PCwSCKnb0E7zHSXFNwAK2ZaKIDCnZw8hOt-lQfOR8ZunnuaH7IgftTG"}>
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}