import React from "react";
import Image from "next/image";
import topNavBanner from "@/app/assets/homepage/customize_it_banner.png";
import CategoryCard, { CategoryCardItem } from "@/components/CategoryCard";

const halfZipDesigns: CategoryCardItem[] = [
  {
    id: "soul-half-zip",
    title: "Soul Half Zip",
    buttonLabel: "Customise",
    href: "/categories/leisurewear/half-zip/soul-half-zip",
  },
  {
    id: "half-zip-design-2",
    title: "Half Zip Design 2",
    buttonLabel: "Customise",
    href: "",
  },
  {
    id: "half-zip-design-3",
    title: "Half Zip Design 3",
    buttonLabel: "Customise",
    href: "",
  },
];

export default function HalfZipPage() {
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

      <section className="w-full px-4 md:px-8 py-8">
        <CategoryCard cards={halfZipDesigns} />
      </section>
    </main>
  );
}
