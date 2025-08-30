import Carousel3D from "../../components/shared/Carousel3D";

const photos_2023_2024 = [
  { id: 1, src: "/images/placeholder-1.png", caption: "Kencan Pertama Kita" },
  { id: 2, src: "/images/placeholder-1.png", caption: "Jalan-jalan di Kota Tua" },
  { id: 3, src: "/images/placeholder-1.png", caption: "Makan Malam Romantis" },
  { id: 4, src: "/images/placeholder-1.png", caption: "Nonton Konser Bareng" },
  { id: 5, src: "/images/placeholder-1.png", caption: "Liburan ke Pantai" },
  { id: 6, src: "/images/placeholder-1.png", caption: "Senja di Tepi Danau" },
  { id: 7, src: "/images/placeholder-1.png", caption: "Ngopi Sampai Larut" },
  { id: 8, src: "/images/placeholder-1.png", caption: "Hujan, Payung, dan Pelukan" },
  { id: 9, src: "/images/placeholder-1.png", caption: "Piknik di Taman" },
  { id: 10, src: "/images/placeholder-1.png", caption: "Midnight Drive" },
  { id: 11, src: "/images/placeholder-1.png", caption: "Kejutan Ulang Tahun" },
  { id: 12, src: "/images/placeholder-1.png", caption: "Sunrise Pertama Bersama" },
];

const photos_2024_2025 = [
  { id: 1, src: "/images/placeholder-1.png", caption: "Weekend Getaway" },
  { id: 2, src: "/images/placeholder-1.png", caption: "Museum Date" },
  { id: 3, src: "/images/placeholder-1.png", caption: "Masak Bareng di Rumah" },
  { id: 4, src: "/images/placeholder-1.png", caption: "Konser Kedua" },
  { id: 5, src: "/images/placeholder-1.png", caption: "Staycation City Light" },
  { id: 6, src: "/images/placeholder-1.png", caption: "Roadtrip Panjang" },
  { id: 7, src: "/images/placeholder-1.png", caption: "Beli Buku Berdua" },
  { id: 8, src: "/images/placeholder-1.png", caption: "LDR tapi Tetap Dekat" },
  { id: 9, src: "/images/placeholder-1.png", caption: "Another Picnic" },
  { id: 10, src: "/images/placeholder-1.png", caption: "Sunset di Bukit" },
  { id: 11, src: "/images/placeholder-1.png", caption: "Anniversary Trip" },
  { id: 12, src: "/images/placeholder-1.png", caption: "New Year Fireworks" },
];

const allPhotos = {
  "2023-2024": photos_2023_2024,
  "2024-2025": photos_2024_2025,
};

export default function UsPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/3 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-rose-300 via-pink-200 to-fuchsia-200" />
        <div className="absolute bottom-0 right-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-rose-200 via-pink-300 to-rose-100" />
        <div className="absolute top-1/4 right-0 h-[22rem] w-[22rem] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-fuchsia-200 via-pink-100 to-rose-100" />
      </div>

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-10 text-center">
        <h1 className="font-serif text-5xl sm:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-500 bg-clip-text text-transparent">Our Captured Moments</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A gallery of our journey — every frame a heartbeat, every chapter a little miracle.
        </p>
      </section>

      <Carousel3D allPhotos={allPhotos} />

      <section className="h-[42vh] bg-gradient-to-t from-rose-50 via-rose-100/60 to-transparent flex items-center justify-center px-6">
        <p className="font-serif text-2xl md:text-3xl text-pink-500/90 italic">
          and to many more memories to come…
        </p>
      </section>
    </div>
  );
}
