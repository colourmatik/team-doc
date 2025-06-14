"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { toast } from "sonner";
import { getUsers, getDocuments } from "./actions";
import { Id } from "../../../../convex/_generated/dataModel";
import { RIGHT_MARGIN_DEFAULT, LEFT_MARGIN_DEFAULT } from "@/constants/margins";


type User ={id: string; name: string; avatar: string; color:string};

export function Room({ children }: { children: ReactNode }) {
    const params = useParams();

    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers =useMemo(
      ()=>async () =>{
        try{
          const list = await getUsers();
          setUsers(list);
        } catch {
          toast.error("Не удалось получить пользоввтелей")
        }
      },
      [],
    );

    useEffect(() => {
      fetchUsers();
    }, [fetchUsers]);
  return (
    <LiveblocksProvider 
      throttle={16}
      authEndpoint={async () => {
  const endpoint = "/api/liveblocks-auth";
  const room = params.documentId as string;

  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({ room }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
  });


  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("Liveblocks auth error", error);
    throw new Error(error?.error ?? "Не удалось авторизоваться в Liveblocks");
  }

  return await response.json();
}}


      resolveUsers={({ userIds }) => {
  const resolvedUsers = userIds.map((userId) => {
    const user = users.find((u) => u.id === userId);
    return user ?? undefined;
  });

  return resolvedUsers;
}}
      resolveMentionSuggestions={({text}) => {
        if (!users || users.length === 0) return [];
        let filteredUsers = users;

        if (text) {
          filteredUsers = users.filter((user) =>
          user.name.toLowerCase().includes(text.toLowerCase())
        );
        }

        return filteredUsers.map((user) => user.id)
      }
    }
      resolveRoomsInfo={async ({roomIds}) => {
        const documents =await getDocuments(roomIds as Id<"documents">[]);
        return documents.map((document) => ({
          id:document.id,
          name:document.name,
        }));
      }}
    >
      <RoomProvider id={params.documentId as string} initialStorage={{leftMargin: LEFT_MARGIN_DEFAULT, rightMargin: RIGHT_MARGIN_DEFAULT}}>
        <ClientSideSuspense fallback={<FullscreenLoader label="Загрузка комнаты..."/>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}