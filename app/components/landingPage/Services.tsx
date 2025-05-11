import IconCard1 from "@/public/card/iconCard1";
import IconCard2 from "@/public/card/iconCard2";
import IconCard3 from "@/public/card/iconCard3";
import React from "react";

export default function Services() {
  return (
    <main>
      {/* Start Section Layanan */}
      <section
        className="container mx-auto mt-[80px] h-auto px-4 md:px-8 lg:px-16"
        id="Services"
      >
        <div className="flex flex-col items-center justify-center pt-[20px] sm:pt-[100px] md:pt-[120px]">
          <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
            Layanan Kami
          </h1>
          <span className="mt-5 h-[2px] w-14 bg-black"></span>
        </div>
        <div className="mx-auto mt-[40px] flex max-w-screen-lg flex-col items-center">
          <p className="mt-6 text-center text-gray-600 sm:text-[10px] lg:text-[16px]">
            Dengan Pay Wise, Anda dapat mengelola hutang dengan lebih mudah dan
            teratur, menjadikan proses pencatatan keuangan Anda lebih efisien
            dan bebas dari kekacauan. Kami berkomitmen untuk membantu Anda
            menjaga kontrol penuh atas transaksi keuangan, memastikan segala
            sesuatu berjalan lancar dan sesuai rencana.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="h-[320px] w-[300px] rounded-lg border border-gray-300 bg-[#bae6fd] p-4 shadow-md transition-all duration-200 hover:scale-105 sm:w-[300px] md:w-[350px] lg:w-[300px]">
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex justify-center">
                  <IconCard1 />
                </div>
                <h3 className="mt-4 text-center text-xl font-bold">
                  Pencatatan Hutang
                </h3>
                <p className="mt-2 text-center text-gray-500">
                  Kami memudahkan Anda mencatat setiap transaksi hutang dengan
                  cepat dan akurat.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="h-[320px] w-[300px] rounded-lg border border-gray-300 bg-[#bae6fd] p-4 shadow-md transition-all duration-200 hover:scale-105 sm:w-[300px] md:w-[350px] lg:w-[300px]">
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex justify-center">
                  <IconCard2 />
                </div>
                <h3 className="mt-4 text-center text-xl font-bold">
                  Ringkasan Total Hutang
                </h3>
                <p className="mt-2 text-center text-gray-500">
                  Pantau jumlah total hutang yang belum dilunasi dalam satu
                  tampilan yang mudah dipahami.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="h-[320px] w-[300px] rounded-lg border border-gray-300 bg-[#bae6fd] p-4 shadow-md transition-all duration-200 hover:scale-105 sm:w-[300px] md:w-[350px] lg:w-[300px]">
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex justify-center">
                  <IconCard3 />
                </div>
                <h3 className="mt-4 text-center text-xl font-bold">
                  Laporan Keuangan
                </h3>
                <p className="mt-2 text-center text-gray-500">
                  Dapatkan laporan ringkas tentang status hutang dan pembayaran
                  dengan mudah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Section Layanan */}
    </main>
  );
}
