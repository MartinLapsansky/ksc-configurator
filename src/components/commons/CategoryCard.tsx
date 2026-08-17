"use client";

import React from "react";
import Link from "next/link";

export interface CategoryCardItem {
  id: string;
  title: string;
  buttonLabel: string;
  href: string;
}

interface CategoryCardProps {
  cards: CategoryCardItem[];
  mobileTwoColumns?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  cards,
  mobileTwoColumns = true,
}) => {
  return (
    <div
      className={`mx-auto h-full w-full max-w-none items-stretch justify-center pt-2 pb-6 md:flex md:flex-wrap md:gap-6 md:pt-2 md:pb-12 ${
        mobileTwoColumns ? "grid grid-cols-2 gap-3" : "flex flex-wrap gap-6"
      }`}
    >
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href || "#"}
          className={`group relative flex min-w-0 min-h-70 flex-col items-center justify-center rounded-2xl bg-gray-300 p-4 cursor-pointer shadow-md transition-transform hover:scale-[1.02] hover:bg-gray-400 md:min-w-70 md:min-h-100 md:p-8 ${
            mobileTwoColumns ? "flex-1" : "w-full md:flex-1"
          }`}
        >
          <h2 className="text-center text-lg font-bold text-gray-800 group-hover:text-lime-green md:text-3xl">
            {card.title}
          </h2>

          <span className="mt-4 self-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 md:absolute md:bottom-15 md:left-15 md:mt-6 md:self-start md:px-5 md:py-2.5 md:text-lg">
            {card.buttonLabel}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryCard;