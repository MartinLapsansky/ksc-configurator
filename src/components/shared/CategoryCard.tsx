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
      className={`mx-auto h-full w-full max-w-none items-stretch justify-center gap-6 pb-6 pt-2 md:flex md:flex-wrap md:pb-12 md:pt-2 ${
        mobileTwoColumns ? "grid grid-cols-2 gap-3 md:gap-6" : "flex flex-wrap"
      }`}
    >
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href || "#"}
          className={`group relative flex min-h-70 w-full min-w-0 flex-col items-center rounded-2xl bg-gray-300 p-4 transition-transform hover:bg-gray-400 hover:scale-[1.02] md:min-h-96 md:min-w-70 md:p-8 ${
            mobileTwoColumns ? "flex-1" : "md:flex-1"
          }`}
        >
          <div className="flex flex-1 items-center justify-center">
            <h2 className="text-center text-lg font-bold text-gray-800 group-hover:text-lime-green md:text-3xl">
              {card.title}
            </h2>
          </div>

          <span className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 md:px-5 md:py-2.5 md:text-lg">
            {card.buttonLabel}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryCard;