import React from "react";
import Link from "next/link";
import Image from "next/image";
import customiserIconMain from "@/assets/customiser-icon-main.png";

export interface CategoryCardItem {
  id: string;
  title: string;
  href: string;
  coverImageUrl: string | null;
  kind: "category" | "product";
  isTopLevel?: boolean;
}

interface CategoryCardProps {
  cards: CategoryCardItem[];
  mobileTwoColumns?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ cards }) => {
  const hasTopLevel = cards.some(
    (card) => card.kind === "category" && card.isTopLevel === true,
  );

  const gridClass = hasTopLevel
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  const maxWidthClass = "max-w-7xl";

  const imageSizes = hasTopLevel
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";

  return (
    <div
      className={`mx-auto h-full w-full grid gap-6 pb-6 pt-2 md:pb-12 md:pt-2 ${gridClass} ${maxWidthClass}`}
    >
      {cards.map((card) => {
        const isCategory = card.kind === "category";
        const isTopLevelCategory = isCategory && card.isTopLevel === true;

        const sizeClass = !isCategory
          ? "aspect-[5/7] w-full min-w-0 p-0 max-w-[340px] mx-auto"
          : isTopLevelCategory
            ? "aspect-[4/5] w-full min-w-0 p-0"
            : "aspect-[5/7] w-full min-w-0 p-0";

        const imageClass =
          "object-cover transition-transform group-hover:scale-105";

        return (
          <div key={card.id} className="flex min-w-0 flex-col items-center">
            <Link
              href={card.href || "#"}
              className={`group relative flex flex-col items-center justify-center overflow-hidden border border-gray-200 shadow-sm transition-transform hover:scale-[1.02] ${sizeClass} ${
                card.coverImageUrl ? "bg-none" : "bg-gray-300"
              }`}
            >
              {card.coverImageUrl && (
                <Image
                  src={card.coverImageUrl}
                  alt={card.title}
                  fill
                  sizes={imageSizes}
                  quality={90}
                  className={imageClass}
                />
              )}

              {card.coverImageUrl && (
                <div className="absolute inset-0 bg-black/10" />
              )}

              {isCategory && (
                <span className="pointer-events-none absolute bottom-8 left-10 z-20">
                  <span className="inline-flex items-center rounded-3xl bg-white px-2 py-2 text-sm font-normal text-black shadow-sm transition-colors group-hover:bg-[#008DD2] group-hover:text-white md:px-3 md:py-1.5 md:text-lg">
                    {card.title}
                  </span>
                </span>
              )}

              {card.kind === "product" && (
                <span
                  className="
                  pointer-events-none absolute left-4 top-4 z-20
                  flex h-10 w-10 items-center overflow-hidden
                  rounded-full bg-white
                  transition-all duration-300
                  group-hover:w-32
                  md:left-8 md:top-8
                "
                >
                  <span className="relative h-10 w-10 shrink-0 p-1">
                    <Image
                      src={customiserIconMain}
                      alt=""
                      width={70}
                      height={70}
                      className="h-full w-full object-contain"
                    />
                  </span>

                  <span
                    className="
                    whitespace-nowrap pl-1 pr-4
                    text-sm font-semibold text-gray-900
                    opacity-0 transition-opacity duration-200
                    group-hover:opacity-100
                  "
                  >
                    Customise
                  </span>
                </span>
              )}
            </Link>

            {card.kind === "product" && (
              <h2 className="mt-3 text-center text-lg font-bold text-gray-800 transition-colors md:text-3xl">
                {card.title}
              </h2>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryCard;