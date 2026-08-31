import React from "react";
import CrewNeckProductItem from "@/components/screens/crewNeck/CrewNeckProductItem";
import Breadcrumbs from "@/components/commons/Breadcrumbs";

export default function HeliosCrewNeckPage() {
  return (
    <main className="min-h-screen bg-white">
      <Breadcrumbs />

      <div className="p-4 md:p-8">
        <CrewNeckProductItem productName="Helios Crew Neck" />
      </div>
    </main>
  );
}
