"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/formatter";
import { DashboardChartSkeleton } from "./DashboardChartSkeleton";

interface Chart1Data {
  name: string;
  totalDebt: number;
  totalPayment: number;
}

interface Chart2Data {
  date: string;
  totalPayment: number;
}

export function DashboardCharts() {
  const [chart1, setChart1] = useState<Chart1Data[] | null>(null);
  const [chart2, setChart2] = useState<Chart2Data[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/charts")
      .then((res) => res.json())
      .then((data) => {
        setChart1(data.chart1);
        setChart2(data.chart2);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardChartSkeleton />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Chart 1 */}
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Perbandingan Utang vs Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart1 || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatRupiah} tick={{ fontSize: 12 }} />
              <RechartsTooltip
                formatter={(value: number) => formatRupiah(value)}
                contentStyle={{ fontSize: "12px" }}
                itemStyle={{ fontSize: "12px" }}
              />
              <Bar dataKey="totalDebt" fill="#f97316" name="Total Utang" />
              <Bar dataKey="totalPayment" fill="#22c55e" name="Total Pembayaran" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart 2 */}
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Tren Pembayaran Harian</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart2 || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatRupiah} tick={{ fontSize: 12 }} />
              <RechartsTooltip
                formatter={(value: number) => formatRupiah(value)}
                contentStyle={{ fontSize: "12px" }}
                itemStyle={{ fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="totalPayment"
                stroke="#3b82f6"
                name="Total Pembayaran"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
