import type { Metadata } from "next";
import {Inter} from "next/font/google"
import {NuqsAdapter} from "nuqs/adapters/next/app"

import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ruRU } from '@clerk/localizations'

import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";

import "./globals.css";


export const customRu = {
  ...ruRU,


  formFieldLabel__organizationName: "Название организации",
  formFieldInputPlaceholder__organizationName: "Введите название",

  formFieldLabel__organizationSlug: "Идентификатор",
  formFieldInputPlaceholder__organizationSlug: "primer-vvoda",

  formFieldLabel__organizationProfileLogo: "Логотип",
  formFieldInputPlaceholder__organizationProfileLogo: "",

  organizationProfile: {
    ...(ruRU.organizationProfile || {}),
    membersPage: {
      ...(ruRU.organizationProfile?.membersPage || {}),
      action__invite: "Пригласить",
      action__search: "Поиск",
    }},
};



const inter = Inter ({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TeamDoc",
  description: "Simple app for working with documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
    localization={customRu}
    appearance={{
    layout: {
      unsafe_disableDevelopmentModeWarnings: true,
    },
  }}
    >
    <html lang="ru">
      <body
        className={inter.className}
      >
        <NuqsAdapter>
          <ConvexClientProvider>
            <Toaster/>
          {children}
          </ConvexClientProvider>
        </NuqsAdapter>
      </body>
    </html>
    </ClerkProvider>
  );
}
