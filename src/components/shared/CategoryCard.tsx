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
  /**
   * Marks a top-level category card (e.g. Leisurewear, Sports Kit) which uses a
   * landscape cover. Sub-category cards use a portrait cover instead.
   */
  isTopLevel?: boolean;
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
      {cards.map((card) => {
        const isCategory = card.kind === "category";
        const isTopLevelCategory = isCategory && card.isTopLevel === true;

        // Product cards keep their original look; category covers fill the whole
        // card without padding, using the aspect ratio of their cover asset
        // (top-level categories are landscape, sub-categories are portrait).
        const sizeClass = !isCategory
          ? "h-72 w-full min-w-0 p-4 md:h-170 md:w-150 md:p-8"
          : isTopLevelCategory
            ? "aspect-[7/5] w-full min-w-0 p-0 md:w-150"
            : "aspect-[5/7] w-full min-w-0 p-0 md:w-150";

        const imageClass = isCategory
          ? "object-cover transition-transform group-hover:scale-105"
          : "object-contain p-6 transition-transform group-hover:scale-105";

        return (
          <div key={card.id} className="flex min-w-0 flex-col items-center">
            <Link
                href={card.href || "#"}
                className={`group relative flex flex-col items-center justify-center overflow-hidden border border-gray-200 shadow-sm transition-transform hover:scale-[1.02] ${sizeClass} ${
                    card.coverImageUrl ? "bg-gray-100" : "bg-gray-300"
                }`}
            >
              {card.coverImageUrl && (
                  <Image
                      src={card.coverImageUrl}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 320px"
                      className={imageClass}
                  />
              )}

              {card.coverImageUrl && (
                  <div className="absolute inset-0 bg-black/10" />
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

            <h2 className="mt-3 text-center text-lg font-bold text-gray-800 transition-colors md:text-3xl">
              {card.title}
            </h2>
          </div>
        );
      })}

    </div>
  );
};

export default CategoryCard;