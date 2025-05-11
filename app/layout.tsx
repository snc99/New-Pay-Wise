"use client";

import { Mulish } from "next/font/google";
// import { usePathname } from "next/navigation";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
const mulish = Mulish({ subsets: ["latin"] });
// const disableNavbar = ["/auth/login", "/dashboard"];
// const disableFooter = ["/auth/login", "/dashboard"];

const title = "Pay Wise";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body className={mulish.className}>{children}</body>
    </html>
  );
}
