"use client"

import {ReactNode} from "react";
import {ConvexReactClient, Authenticated, Unauthenticated, AuthLoading} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {ClerkProvider, useAuth} from "@clerk/nextjs";
import { FullscreenLoader } from "./fullscreen-loader";
import { ruRU } from "@clerk/localizations";
import AuthSwitcher from "./auth-switcher";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({children}: {children:ReactNode}) {
    return(
        <ClerkProvider localization={ruRU} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
         <ConvexProviderWithClerk
          useAuth={useAuth} 
          client={convex}   
          >
            <Authenticated>
            {children}
            </Authenticated>
            <Unauthenticated>
           <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthSwitcher />
           </div>
            </Unauthenticated>
            <AuthLoading>
            <FullscreenLoader label="Загрузка данных пользователя..."/>
            </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}