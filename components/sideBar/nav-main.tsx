"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

export function NavMain({
  features,
  settings,
}: {
  features: NavItem[];
  settings: NavItem[];
}) {
  const pathname = usePathname();

  const renderMenuItems = (items: NavItem[]) =>
    items.map((item) => {
      const isActive = item.isActive ?? pathname === item.url;

      if (item.items && item.items.length > 0) {
        return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => {
                    const isSubActive = pathname === subItem.url;
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className={`block w-full px-3 py-2 rounded-md transition ${
                              isSubActive
                                ? "bg-gray-200 text-gray-900"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      }

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            <Link
              href={item.url}
              className={`flex items-center gap-3 px-2 py-2 rounded-md transition ${
                item.isActive
                  ? "font-semibold text-blue-500 bg-blue-100" // bold + warna biru muda
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <div>
      <SidebarGroup className="mb-4">
        <SidebarGroupLabel className="font-bold text-gray-600 ">
          Fitur
        </SidebarGroupLabel>
        <SidebarMenu>{renderMenuItems(features)}</SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="font-bold text-gray-600">
          Setting
        </SidebarGroupLabel>
        <SidebarMenu>{renderMenuItems(settings)}</SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
