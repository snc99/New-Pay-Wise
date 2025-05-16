"use client";

import { Mulish } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const mulish = Mulish({ subsets: ["latin"] });
const title = "Pay Wise";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body className={mulish.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
