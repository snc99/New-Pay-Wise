import IconCard4 from "@/public/card/iconCard4";
import IconCard5 from "@/public/card/iconCard5";
import IconCard6 from "@/public/card/iconCard6";
import React from "react";

export default function Contact() {
  return (
    <main>
      {/* Section Kontak */}
      <section
        className="container mx-auto min-h-screen px-4 pb-6 md:px-8 lg:px-16"
        id="Contact"
      >
        <div className="flex flex-col items-center justify-center pt-[80px] sm:pt-[100px] md:pt-[120px]">
          <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
            Kontak Kami
          </h1>
          <span className="mt-2 h-[2px] w-14 bg-black"></span>
        </div>

        <div className="mx-auto mt-[40px] flex max-w-screen-lg flex-col items-center">
          <p className="mt-6 text-center text-gray-600 sm:text-[20px] lg:text-[16px]">
            Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut,
            jangan ragu untuk menghubungi kami melalui informasi di bawah ini.
          </p>
          <div className="mt-[40px] grid grid-cols-1 gap-8 sm:mt-[100px] sm:grid-cols-2 lg:mt-[120px] lg:grid-cols-3">
            {/* Card 1 */}
            <div className="h-full w-full rounded-lg border border-gray-300 bg-[#e0f2fe] p-4 shadow-md transition-transform duration-200 hover:scale-105 sm:w-[380px] md:w-[320px] lg:w-[320px]">
              <div className="flex items-start">
                <IconCard4 />
                <div className="ml-4">
                  <h3 className="mb-2 text-xl font-bold">Alamat</h3>
                  <p className="mt-1 text-gray-700">Jl. Sagong RT 02 RW 06</p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="h-full w-full rounded-lg border border-gray-300 bg-[#e0f2fe] p-4 shadow-md transition-transform duration-200 hover:scale-105 sm:w-[350px] md:w-[320px] lg:w-[320px]">
              <div className="flex items-start">
                <IconCard5 />
                <div className="ml-4">
                  <h3 className="mb-2 text-xl font-bold">Telepon</h3>
                  <p className="mt-1 text-gray-700">08764523445</p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="h-full w-full rounded-lg border border-gray-300 bg-[#e0f2fe] p-4 shadow-md transition-transform duration-200 hover:scale-105 sm:w-[350px] md:w-[320px] lg:w-[320px]">
              <div className="flex items-start">
                <IconCard6 />
                <div className="ml-4">
                  <h3 className="mb-2 text-xl font-bold">Email</h3>
                  <p className="mt-1 text-gray-700">Paywise@gmail.co.id</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Section Kontak */}
    </main>
  );
}
