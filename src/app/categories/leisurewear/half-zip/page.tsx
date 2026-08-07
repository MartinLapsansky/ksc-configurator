import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";

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
      {/* Top Banner - navigates to home page */}
      <TopBanner />

      <section className="w-full px-4 md:px-8 py-8">
        <CategoryCard cards={halfZipDesigns} />
      </section>
    </main>
  );
}
