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
    localization={ruRU}
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
