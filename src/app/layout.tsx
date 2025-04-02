import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
// import Test from "./test";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "youtube_xizi",
  description: "clone youtube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en">
        <body className={`${inter.className} `}>
          <TRPCProvider>
            <Toaster />
            {children}
            {/* <Test /> */}
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
