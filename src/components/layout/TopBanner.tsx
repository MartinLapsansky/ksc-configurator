import React from "react";
import Link from "next/link";
import Image from "next/image";
import topNavBanner from "@/assets/homepage/customize_it_banner.png";
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

      <Link href="/" className="block relative w-full h-[30vh] overflow-hidden" aria-label="Go to home page">
        <Image
          className="object-cover"
          src={topNavBanner}
          alt="Top banner"
          fill
          priority
          sizes="100vw"
        />
      </Link>
    </div>
  );
}