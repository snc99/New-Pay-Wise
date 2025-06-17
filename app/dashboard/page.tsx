"use client";

import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <DashboardCards />
      <DashboardCharts />{" "}
    </div>
  );
}
