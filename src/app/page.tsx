"use client";

import React from "react";
import Image from "next/image";
import topNavBanner from "@/app/assets/homepage/customize_it_banner.png";

interface HomeCard {
  id: string;
  title: string;
  buttonLabel: string;
  href: string;
}

const cards: HomeCard[] = [
  {
    id: "sports",
    title: "Category: Sports Kit",
    buttonLabel: "Sports Kit",
    href: "/categories/sportswear",
  },
  {
    id: "leisure",
    title: "Category: Leisurewear",
    buttonLabel: "Leisurewear",
    href: "/categories/leisurewear",
  },
];

export default function HomePage() {
  return (
    <main className="min-w-screen min-h-screen bg-slate-100">
      {/* Top Banner - 30% of viewport height */}
      <div className="relative w-full h-[30vh] overflow-hidden">
        <Image
          className="object-cover"
          src={topNavBanner}
          alt="Top banner"
          fill
          priority
          sizes="100vw"
        />
      </div>

      {/* Cards Section - fills remaining height to 100vh */}
      <section className="w-full px-4 md:px-8" style={{ height: "70vh" }}>
        <div className="mx-auto flex h-full w-full max-w-none flex-col items-stretch justify-center gap-6 py-8 md:flex-row md:py-12">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative flex min-w-[200px] flex-1 flex-col items-start justify-start rounded-2xl bg-gray-300 p-8 cursor-pointer shadow-md transition-transform hover:scale-[1.02] hover:bg-gray-400"
            >
              {/* Main heading top-left */}
              <h2 className="text-left mt-20 ml-10 text-2xl font-bold text-gray-800 group-hover:text-lime-green md:text-3xl">
                {card.title}
              </h2>

              {/* Button at bottom-left - absolute on desktop, relative on mobile */}
              <a
                href={card.href}
                className="md:absolute md:bottom-15 md:left-15 mt-6 ml-10 self-start rounded-lg cursor-pointer bg-black px-5 py-2.5 text-lg font-semibold text-white transition hover:bg-gray-800"
              >
                {card.buttonLabel}
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
