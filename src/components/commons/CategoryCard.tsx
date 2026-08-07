"use client";

import React from "react";

export interface CategoryCardItem {
  id: string;
  title: string;
  buttonLabel: string;
  href: string;
}

interface CategoryCardProps {
  cards: CategoryCardItem[];
}

const CategoryCard: React.FC<CategoryCardProps> = ({ cards }) => {
  return (
    <div className="mx-auto flex h-full w-full max-w-none flex-wrap items-stretch justify-center gap-6 py-8 md:py-12">
      {cards.map((card) => (
        <div
          key={card.id}
          className="group relative flex min-w-70 min-h-100 flex-1 flex-col items-center justify-center rounded-2xl bg-gray-300 p-8 cursor-pointer shadow-md transition-transform hover:scale-[1.02] hover:bg-gray-400"
        >
          <h2 className="text-center text-2xl font-bold text-gray-800 group-hover:text-lime-green md:text-3xl">
            {card.title}
          </h2>

          <a
            href={card.href}
            className="md:absolute md:bottom-15 md:left-15 mt-6 self-center md:self-start rounded-lg cursor-pointer bg-black px-5 py-2.5 text-lg font-semibold text-white transition hover:bg-gray-800"
          >
            {card.buttonLabel}
          </a>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
