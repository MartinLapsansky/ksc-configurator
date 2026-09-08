import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/shared/CategoryCard";
import TopBanner from "@/components/layout/TopBanner";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

const crewNeckDesigns: CategoryCardItem[] = [
  {
    id: "helios-crew-neck",
    title: "Helios Crew Neck",
    buttonLabel: "Customise",
    href: "/leisurewear/crew-necks/helios-crew-neck",
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
    <main className="w-full min-h-screen bg-white">
      <TopBanner />
      <Breadcrumbs />

      <section className="w-full px-4 md:px-8 py-8">
        <CategoryCard cards={crewNeckDesigns} />
      </section>
    </main>
  );
}
