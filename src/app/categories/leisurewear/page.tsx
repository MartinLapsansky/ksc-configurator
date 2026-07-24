"use client";

import React from "react";
import Image from "next/image";
import topNavBanner from "@/app/assets/homepage/customize_it_banner.png";

interface CategoryCard {
  id: string;
  title: string;
  buttonLabel: string;
  href: string;
}

const categories: CategoryCard[] = [
  {
    id: "hoodies",
    title: "Zip Tops",
    buttonLabel: "Explore",
    href: "/categories/leisurewear/half-zip",
  },
  {
    id: "tracksuits",
    title: "Crew necks",
    buttonLabel: "Explore",
    href: "",
  },
  {
    id: "caps",
    title: "Shorts",
    buttonLabel: "Explore",
    href: "",
  },
];

export default function LeisurewearPage() {
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
          {categories.map((card) => (
            <div
              key={card.id}
              className="group relative flex min-w-[200px] flex-1 flex-col items-center justify-center rounded-2xl bg-gray-300 p-8 cursor-pointer shadow-md transition-transform hover:scale-[1.02] hover:bg-gray-400"
            >
              {/* Main heading centered */}
              <h2 className="text-center text-2xl font-bold text-gray-800 group-hover:text-lime-green md:text-3xl">
                {card.title}
              </h2>

              {/* Button at bottom-left - absolute on desktop, relative on mobile */}
              <a
                href={card.href}
                className="md:absolute md:bottom-15 md:left-15 mt-6 self-start rounded-lg cursor-pointer bg-black px-5 py-2.5 text-lg font-semibold text-white transition hover:bg-gray-800"
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
