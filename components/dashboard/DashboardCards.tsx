"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, Wallet } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { DashboardCardSkeleton } from "./DashboardCardSkeleton";

// Tipe data dari API
interface DashboardData {
  totalUsers: number;
  totalPayments: number;
  totalDebts: number;
  totalPaidUsers: number;
}

export const DashboardCards = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard/cards");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <DashboardCardSkeleton />;

  return (
    <div className="flex flex-1 flex-col ">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {/* Card 1 - Total User */}
        <DashboardCard
          title="Total User"
          value={data?.totalUsers.toString() ?? "-"}
          subtitle="Pengguna"
          icon={<Users className="h-6 w-6" />}
        />

        {/* Card 2 - Total Bayar */}
        <DashboardCard
          title="Total Bayar"
          value={`Rp ${Number(data?.totalPayments || 0).toLocaleString(
            "id-ID"
          )}`}
          subtitle={`${data?.totalPaidUsers ?? 0} Pengguna`}
          icon={<DollarSign className="h-6 w-6" />}
        />

        {/* Card 3 - Total Utang */}
        <DashboardCard
          title="Total Hutang"
          value={`Rp ${Number(data?.totalDebts || 0).toLocaleString("id-ID")}`}
          subtitle="Pengguna"
          icon={<Wallet className="h-6 w-6" />}
        />
      </div>
    </div>
  );
};
