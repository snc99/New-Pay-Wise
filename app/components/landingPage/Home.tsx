import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section
        className="container mx-auto flex h-screen flex-col items-center justify-center px-4 md:flex-row md:px-8 lg:px-16"
        id="Home"
      >
        {/* Konten Teks */}
        <div className="max-w-lg text-center md:w-1/2 md:text-left">
          <h1 className="text-[32px] font-bold sm:text-[40px] lg:text-[48px]">
            <span className="text-blue-new">Pay Wise </span>- Manajemen Hutang
            Anda Jadi Mudah!
          </h1>
          <p className="mt-6 text-sm text-gray-600 sm:text-base lg:text-lg">
            Kelola catatan hutang dan piutang dengan praktis dan teratur. Dengan
            Pay Wise, Anda bisa mencatat transaksi dan memantau status keuangan
            secara efisien.
          </p>
        </div>

        {/* Gambar */}
        <div className="mt-8 flex items-center justify-center md:mt-0 md:h-1/2 lg:w-1/2">
          <Image
            src="/background/home.png"
            alt="Header Image"
            width={900}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}
