import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/shared/CategoryCard";
import TopBanner from "@/components/layout/TopBanner";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

const categories: CategoryCardItem[] = [
  {
    id: "jerseys",
    title: "Jerseys",
    buttonLabel: "Customise",
    href: "/sportswear/jerseys",
  },
  {
    id: "shorts",
    title: "Shorts",
    buttonLabel: "Explore",
    href: "",
  },
  {
    id: "socks",
    title: "Gym vests",
    buttonLabel: "Explore",
    href: "",
  },
  {
    id: "socks",
    title: "Athletic singlets",
    buttonLabel: "Explore",
    href: "",
  },
];

export default function SportswearPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <TopBanner />
      <Breadcrumbs />

      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={categories} />
      </section>
    </main>
  );
}
