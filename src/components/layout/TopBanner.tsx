import React from "react";
import Link from "next/link";
import Image from "next/image";
import topNavBanner from "../../../public/categories/cards/customize_it_logo.png";
import kcsLogoHeader from "@/assets/kcs_logo_header.png";

export default function TopBanner() {
  return (
    <div>
      <header className="relative flex h-[10vh] min-h-16 w-full items-center justify-center overflow-hidden bg-white">
        <Link href="/" className="relative flex items-center justify-center" aria-label="Go to home page">
          <Image
            className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16"
            src={kcsLogoHeader}
            alt="KCS logo"
            width={320}
            height={128}
            priority
            sizes="(max-width: 640px) 8rem, (max-width: 768px) 10rem, (max-width: 1024px) 12rem, 16rem"
          />
        </Link>
      </header>

      <div className="flex h-[10vh] min-h-16 w-full items-center justify-center overflow-hidden bg-black p-4">
        <Link
          href="/"
          className="flex h-full w-full max-w-xs items-center justify-center"
          aria-label="Go to home page"
        >
          <Image
            className="h-full w-auto object-contain"
            src={topNavBanner}
            alt="Top banner"
            width={320}
            height={100}
            priority
            sizes="(max-width: 640px) 200px, 320px"
          />
        </Link>
      </div>

      <div className="flex w-full items-center justify-center py-4">
        <h2 className="text-center text-lg font-normal text-black sm:text-3xl">
          WELCOME TEXT HERE
        </h2>
      </div>
    </div>
  );
}