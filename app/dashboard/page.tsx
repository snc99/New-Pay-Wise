"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (
    !session ||
    !session.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return <div>Akses ditolak.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-500">Total User</p>
          <p className="text-xl font-bold">12</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-500">Total Utang</p>
          <p className="text-xl font-bold">Rp 5.000.000</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-sm text-gray-500">Total Pembayaran</p>
          <p className="text-xl font-bold">Rp 2.500.000</p>
        </div>
      </div>
      <div>
        <p>Selamat datang, {session.user.name}!</p>
        <p>Role: {session.user.role}</p>

        {/* Tombol Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
