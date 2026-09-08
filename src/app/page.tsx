import React from "react";
import CategoryCard from "@/components/shared/CategoryCard";
import TopBanner from "@/components/layout/TopBanner";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { getTopLevelCategories } from "@/lib/catalog";

export default async function HomePage() {
  const cards = await getTopLevelCategories();

  return (
    <main className="w-full min-h-screen bg-slate-100">
      {/* Top Banner - navigates to home page */}
      <TopBanner />
      <Breadcrumbs />
      {/* Cards Section */}
      <section className="w-full p-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={cards} mobileTwoColumns={false} />
      </section>
    </main>
  );
}
