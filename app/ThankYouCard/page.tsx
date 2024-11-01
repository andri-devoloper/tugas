import Link from "next/link";
import React from "react";

const ThankYouCard: React.FC = () => {
  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Terima Kasih! 🎉
            <span className="sm:block"> Selamat Belajar yang Giat! 📚 </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            Kami menghargai usaha dan dedikasi Anda 😊. Semoga setiap langkah dalam perjalanan belajar Anda memberikan inspirasi dan pengetahuan baru!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              href={'https://andev.my.id/'}
            >
              Kembali ke Beranda 🏠
            </Link>

            <Link
              className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              href="#"
            >
              Lihat Materi Belajar 📖
            </Link>
          </div>
        </div>
      </div>
    </section>

  );
};

export default ThankYouCard;
