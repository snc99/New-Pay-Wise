import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <main>
      {/* Section About Us */}
      <section
        className="container mx-auto px-4 py-8 md:px-8 lg:px-16"
        id="About"
      >
        <div className="flex flex-col items-center justify-center pt-[20px] sm:pt-[100px] md:pt-[120px]">
          <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
            About Us
          </h1>
          <span className="mt-5 h-[2px] w-14 bg-black"></span>
        </div>

        {/* Section About 1 */}
        <div className="mt-8 flex flex-col items-center justify-center md:flex-row">
          <div className="w-full md:h-1/2 md:w-1/2">
            <Image
              src="/background/about1.png"
              alt="About Image 1"
              width={900}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="mt-6 max-w-lg text-center md:ml-8 md:mt-0 md:w-1/2 md:text-left">
            <h2 className="text-[28px] font-bold sm:text-[15px] lg:text-[36px]">
              Kelola semua hutang Anda dengan mudah menggunakan fitur di Pay
              Wise.
            </h2>
            <p className="mt-6 text-sm text-gray-600 sm:text-base lg:text-lg">
              Pay Wise kami dirancang untuk memberikan Anda kendali penuh atas
              keuangan Anda dengan cara yang sederhana dan terstruktur.
              Tingkatkan efisiensi pengelolaan keuangan Anda dan hindari
              keterlambatan pembayaran dengan alat pencatatan yang canggih dan
              intuitif.
            </p>
          </div>
        </div>
        {/* End Section About 1 */}

        {/* Section About 2 */}
        <div className="mt-8 flex flex-col items-center justify-center md:flex-row">
          <div className="mt-6 max-w-lg text-center md:ml-8 md:mt-0 md:w-1/2 md:text-left">
            <h2 className="text-[28px] font-bold sm:text-[32px] lg:text-[36px]">
              Pantau dan Kelola Hutang Anda Secara Real-Time
            </h2>
            <p className="mt-6 text-sm text-gray-600 sm:text-base lg:text-lg">
              Kelola semua hutang Anda dengan mudah menggunakan fitur Pencatatan
              Hutang di Pay Wise. Catat setiap transaksi, lacak total hutang,
              dan lihat ringkasan secara real-time. Akses informasi kapan saja
              melalui platform online kami, sehingga Anda selalu terinformasi
              dan dapat mencegah keterlambatan pembayaran.
            </p>
          </div>
          <div className="mt-6 md:ml-7 md:mt-0 md:h-1/2">
            <Image
              src="/background/about2.png"
              alt="About Image 2"
              width={900}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
        {/* End Section About 2 */}
      </section>
      {/* End Section About*/}
    </main>
  );
}
