import Carousel3D from "../../components/shared/Carousel3D";

const photos_2023_2024 = [
  { id: 1, src: "/images/placeholder-12.jpg", caption: "Postan Pertama Kita" },
  { id: 2, src: "/images/placeholder-11.jpg", caption: "BONUS WKWKKW" },
  { id: 3, src: "/images/placeholder-10.jpg", caption: "Kaku Banget Haha" },
  { id: 4, src: "/images/placeholder-9.jpg", caption: "Nugas Bareng Lagii" },
  { id: 5, src: "/images/placeholder-8.jpg", caption: "Kita Nontonn" },
  { id: 6, src: "/images/placeholder-7.jpg", caption: "Ngeselin Aku Harus Ngalah" },
  { id: 7, src: "/images/placeholder-6.jpg", caption: "Gift Pertama Kali dari Kamu" },
  { id: 8, src: "/images/placeholder-5.jpg", caption: "Tempat Favoritku hihi" },
  { id: 9, src: "/images/placeholder-4.jpg", caption: "Foto Malu Malu di MCD" },
  { id: 10, src: "/images/placeholder-3.jpg", caption: "Pertama Kali Ketemu Chandra" },
  { id: 11, src: "/images/placeholder-2.jpg", caption: "Nugas Bareng Pertama Kita" },
  { id: 12, src: "/images/placeholder-1.jpg", caption: "Tempat Kita Jadian" },
];

const photos_2024_2025 = [
  { id: 1, src: "/images/placeholder-13.jpg", caption: "Unicorn" },
  { id: 2, src: "/images/placeholder-24.jpg", caption: "Lupa Ini Apaa" },
  { id: 3, src: "/images/placeholder-23.jpg", caption: "Acara SRE hihi" },
  { id: 4, src: "/images/placeholder-22.jpg", caption: "Bocil Awkward" },
  { id: 5, src: "/images/placeholder-21.jpg", caption: "Double Date Pertama Kita" },
  { id: 6, src: "/images/placeholder-20.jpg", caption: "Kejebak Hujan" },
  { id: 7, src: "/images/placeholder-19.jpg", caption: "Anomali" },
  { id: 8, src: "/images/placeholder-18.jpg", caption: "Lutunaaa" },
  { id: 9, src: "/images/placeholder-17.jpg", caption: "Foto Pertama Setelah..." },
  { id: 10, src: "/images/placeholder-16.jpg", caption: "Foto Terakhir Sebelum..." },
  { id: 11, src: "/images/placeholder-15.jpg", caption: "Konser Pertama Kita" },
  { id: 12, src: "/images/placeholder-14.jpg", caption: "HAHAHAH bocil" },
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
