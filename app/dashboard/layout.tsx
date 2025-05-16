import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
        <div className="bg-white p-4 rounded shadow">{children}</div>
      </div>
    </div>
  );
}
