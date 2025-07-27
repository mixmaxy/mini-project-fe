import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { RoleProvider } from "@/contexts/RoleContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Management Platform",
  description: "Discover and manage events with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} antialiased`}
          suppressHydrationWarning
        >
          <RoleProvider>
            {children}
            <Toaster />
          </RoleProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
