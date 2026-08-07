import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";

const crewNeckDesigns: CategoryCardItem[] = [
  {
    id: "helios-crew-neck",
    title: "Helios Crew Neck",
    buttonLabel: "Customise",
    href: "/categories/leisurewear/crew-neck/helios-crew-neck",
  },
  {
    id: "soul-crew-neck",
    title: "Soul Crew Neck",
    buttonLabel: "Customise",
    href: "",
  },
  {
    id: "nova-crew-neck",
    title: "Nova Crew Neck",
    buttonLabel: "Customise",
    href: "",
  },
];

export default function CrewNeckPage() {
  return (
    <main className="min-w-screen min-h-screen bg-slate-100">
      {/* Top Banner - navigates to home page */}
      <TopBanner />

      <section className="w-full px-4 md:px-8 py-8">
        <CategoryCard cards={crewNeckDesigns} />
      </section>
    </main>
  );
}
