"use client";

import { AppSidebar } from "@/components/sideBar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Users, DollarSign, Wallet } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {/* Card 1 */}
            <div className="relative rounded-xl bg-muted/50 p-4 shadow-md overflow-hidden">
              <div className="relative z-10">
                <div className="text-sm md:text-lg font-semibold">
                  Total User
                </div>
                <div className="mt-2 text-xl md:text-3xl font-bold">120</div>
                <div className="mt-2 text-sm md:text-lg font-semibold">
                  Pengguna
                </div>
              </div>
              <div className="absolute -right-25 -top-10">
                <Image
                  src="/itemscard.png"
                  alt="Shape"
                  width={198}
                  height={230}
                  className="object-contain"
                />
              </div>
              <div className="absolute bottom-4 right-4 text-muted-foreground">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative rounded-xl bg-muted/50 p-4 shadow-md overflow-hidden">
              <div className="relative z-10">
                <div className="text-sm md:text-lg font-semibold">Bayar</div>
                <div className="mt-2 text-xl md:text-3xl font-bold">
                  Rp 2.500.000
                </div>
                <div className="mt-2 text-sm md:text-lg font-semibold">
                  Pengguna
                </div>
              </div>
              <div className="absolute -right-25 -top-10">
                <Image
                  src="/itemscard.png"
                  alt="Shape"
                  width={198}
                  height={230}
                  className="object-contain"
                />
              </div>

              <div className="absolute bottom-4 right-4 text-muted-foreground">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative rounded-xl bg-muted/50 p-4 shadow-md overflow-hidden">
              <div className="relative z-10">
                <div className="text-sm md:text-lg font-semibold">
                  Total Hutang
                </div>
                <div className="mt-2 text-xl md:text-3xl font-bold">
                  Rp 5.000.000
                </div>
                <div className="mt-2 text-sm md:text-lg font-semibold">
                  Pengguna
                </div>
              </div>

              <div className="absolute -right-25 -top-10">
                <Image
                  src="/itemscard.png"
                  alt="Shape"
                  width={198}
                  height={230}
                  className="object-contain"
                />
              </div>

              <div className="absolute bottom-4 right-4 text-muted-foreground">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
