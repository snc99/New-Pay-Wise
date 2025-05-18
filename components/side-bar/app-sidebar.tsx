"use client";

import * as React from "react";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/side-bar/nav-main";
import { NavUser } from "@/components/side-bar/nav-user";
// import { TeamSwitcher } from "@/components/sideBar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPERADMIN";
  const pathname = usePathname();

  console.log("Session:", session);
  console.log("Session Role:", session?.user?.role);

  const userData = {
    name: session?.user?.name || "Admin",
    username: session?.user?.username || "Admin",
    avatar: "/avatars/default.jpg",
  };

  const fiturItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Pengguna",
      url: "/dashboard/user",
      icon: Bot,
      isActive: pathname === "/dashboard/user",
    },
    {
      title: "Pencatatan",
      url: "/dashboard/debit",
      icon: BookOpen,
      isActive: pathname === "/dashboard/debit",
    },
    {
      title: "Pembayaran",
      url: "/dashboard/payment",
      icon: Settings2,
      isActive: pathname === "/dashboard/payment",
    },
  ];

  const settingItems = [
    // Tampilkan menu tambah admin hanya kalau super admin

    ...(isSuperAdmin
      ? [
          {
            title: "Tambah Akun",
            url: "/dashboard/add-account",
            icon: Settings2,
            isActive: pathname === "/dashboard/add-account",
          },
        ]
      : []),
    {
      title: "Lainnya",
      url: "/",
      icon: SquareTerminal,
      isActive: pathname === "/",
    },
  ];

  if (status === "loading") {
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex justify-center items-center">
        <Link href="/dashboard" className="text-xl font-bold tracking-wide p-4">
          PayWise
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain features={fiturItems} settings={settingItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
