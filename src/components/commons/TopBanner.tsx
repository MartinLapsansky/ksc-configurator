"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import topNavBanner from "@/app/assets/homepage/customize_it_banner.png";

export default function TopBanner() {
  return (
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
  );
}