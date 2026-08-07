import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";

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
      {/* Top Banner - navigates to home page */}
      <TopBanner />

      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={jerseyDesigns} />
      </section>
    </main>
  );
}
