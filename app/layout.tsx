import { HeroUIProvider } from "@heroui/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spend Rules - Credit Card Expense Analyzer",
  description: "Analyze and categorize credit card expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <HeroUIProvider>{children}</HeroUIProvider>
      </body>
    </html>
  );
}
