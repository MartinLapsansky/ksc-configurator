import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";
import Breadcrumbs from "@/components/commons/Breadcrumbs";

const categories: CategoryCardItem[] = [
  {
    id: "hoodies",
    title: "Zip Tops",
    buttonLabel: "Explore",
    href: "/leisurewear/half-zip",
  },
  {
    id: "tracksuits",
    title: "Crew necks",
    buttonLabel: "Explore",
    href: "/leisurewear/crew-neck",
  },
  {
    id: "example",
    title: "Example",
    buttonLabel: "Explore",
    href: "",
  },
  {
    id: "example 2",
    title: "Example 2",
    buttonLabel: "Explore",
    href: "",
  },
  {
    id: "example 3",
    title: "Example 3",
    buttonLabel: "Explore",
    href: "",
  },
  {
    id: "example 4",
    title: "Example 4",
    buttonLabel: "Explore",
    href: "",
  },

];

export default function LeisurewearPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <TopBanner />
      <Breadcrumbs />

      {/* Cards Section */}
      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={categories} />
      </section>
    </main>
  );
}
