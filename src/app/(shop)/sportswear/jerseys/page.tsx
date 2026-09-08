import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/shared/CategoryCard";
import TopBanner from "@/components/layout/TopBanner";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

const jerseyDesigns: CategoryCardItem[] = [
  {
    id: "jersey-design-146",
    title: "Jersey Design 146",
    buttonLabel: "Customise",
    href: "/sportswear/jerseys/jersey-design-146",
  },
  {
    id: "jersey-design-173",
    title: "Jersey Design 173",
    buttonLabel: "Customise",
    href: "",
  },
  {
    id: "jersey-design-other",
    title: "Jersey Design 174",
    buttonLabel: "Customise",
    href: "",
  },
  {
    id: "jersey-design-other",
    title: "Jersey Design 175",
    buttonLabel: "Customise",
    href: "",
  },
  {
    id: "jersey-design-other",
    title: "Jersey Design 176",
    buttonLabel: "Customise",
    href: "",
  },
  {
    id: "jersey-design-other",
    title: "Jersey Design 177",
    buttonLabel: "Customise",
    href: "",
  },
];

export default function JerseysPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <TopBanner />
      <Breadcrumbs />

      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={jerseyDesigns} />
      </section>
    </main>
  );
}
