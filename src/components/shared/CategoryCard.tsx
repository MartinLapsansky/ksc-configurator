import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface CategoryCardItem {
  id: string;
  title: string;
  buttonLabel: string;
  href: string;
  coverImageUrl: string | null;
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
          className={`group relative flex min-h-70 w-full min-w-0 flex-col items-center overflow-hidden rounded-2xl bg-gray-300 p-4 transition-transform hover:scale-[1.02] md:min-h-96 md:min-w-70 md:p-8 ${
            mobileTwoColumns ? "flex-1" : "md:flex-1"
          }`}
        >
          {card.coverImageUrl && (
            <Image
              src={card.coverImageUrl}
              alt={card.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          )}

          {card.coverImageUrl && (
            <div className="absolute inset-0 bg-black/40" />
          )}

          <div className="relative z-10 flex flex-1 items-center justify-center">
            <h2
              className={`text-center text-lg font-bold group-hover:text-lime-green md:text-3xl ${
                card.coverImageUrl ? "text-white" : "text-gray-800"
              }`}
            >
              {card.title}
            </h2>
          </div>

          <span className="relative z-10 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 md:px-5 md:py-2.5 md:text-lg">
            {card.buttonLabel}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryCard;