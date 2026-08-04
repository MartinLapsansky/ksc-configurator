import React from "react";
import Image from "next/image";
import topNavBanner from "@/app/assets/homepage/customize_it_banner.png";
import CategoryCard, { CategoryCardItem } from "@/components/CategoryCard";

const jerseyDesigns: CategoryCardItem[] = [
  {
    id: "jersey-design-146",
    title: "Jersey Design 146",
    buttonLabel: "Customise",
    href: "/categories/sportswear/jerseys/jersey-design-146",
  },
  {
    id: "jersey-design-173",
    title: "Jersey Design 173",
    buttonLabel: "Customise",
    href: "",
  },
  {
    id: "jersey-design-other",
    title: "Jersey Design ...",
    buttonLabel: "Customise",
    href: "",
  },
];

export default function JerseysPage() {
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

      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={jerseyDesigns} />
      </section>
    </main>
  );
}
