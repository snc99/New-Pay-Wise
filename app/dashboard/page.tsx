// "use client";

// import { useSession, signOut } from "next-auth/react";

// export default function DashboardPage() {
//   const { data: session, status } = useSession();

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (
//     !session ||
//     !session.user ||
//     (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
//   ) {
//     return <div>Akses ditolak.</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-3 gap-4">
//         <div className="bg-blue-100 p-4 rounded">
//           <p className="text-sm text-gray-500">Total User</p>
//           <p className="text-xl font-bold">12</p>
//         </div>
//         <div className="bg-green-100 p-4 rounded">
//           <p className="text-sm text-gray-500">Total Utang</p>
//           <p className="text-xl font-bold">Rp 5.000.000</p>
//         </div>
//         <div className="bg-yellow-100 p-4 rounded">
//           <p className="text-sm text-gray-500">Total Pembayaran</p>
//           <p className="text-xl font-bold">Rp 2.500.000</p>
//         </div>
//       </div>
//       <div>
//         <p>Selamat datang, {session.user.name}!</p>
//         <p>Role: {session.user.role}</p>

//         {/* Tombol Logout */}
//         <button
//           onClick={() => signOut({ callbackUrl: "/auth/login" })}
//           className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

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
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
