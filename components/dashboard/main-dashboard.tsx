"use client";

import { Users, DollarSign, Wallet } from "lucide-react";
import Image from "next/image";

export const MainDashboard = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {/* Card 1 */}
        <div className="relative rounded-xl bg-muted/50 p-4 shadow-md overflow-hidden">
          <div className="relative z-10">
            <div className="text-sm md:text-lg font-semibold">Total User</div>
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
            <div className="text-sm md:text-lg font-semibold">Total Hutang</div>
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
  );
};
