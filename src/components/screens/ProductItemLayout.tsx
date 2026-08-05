"use client";

import React, { useEffect, useRef, useState } from "react";

type ProductItemLayoutProps = {
  title: string;
  totalDots: number;
  /** The pickers rendered inside the scrollable aside. */
  pickers: React.ReactNode;
  /** The product preview rendered on the right side. */
  preview: React.ReactNode;
  /** Called when the "Enquire" button is clicked. */
  onEnquire: () => void;
};

/**
 * Shared layout shell for all product configurator screens. It owns the
 * scrollable picker aside, the mobile pagination dots and the Enquire button,
 * so each product screen only needs to supply its title, pickers, preview and
 * the enquire handler.
 */
const ProductItemLayout: React.FC<ProductItemLayoutProps> = ({
  title,
  totalDots,
  pickers,
  preview,
  onEnquire,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (maxScroll <= 0) {
        setActiveIndex(0);
        return;
      }

      const progress = scrollLeft / maxScroll;
      const index = Math.round(progress * (totalDots - 1));
      setActiveIndex(index);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [totalDots]);

  return (
    <div className="flex min-h-150 flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row md:h-[90vh] mx-auto">
      <div className="flex flex-col">
        <h1 className="flex mb-1 text-lg text-black font-semibold">{title}</h1>

        <aside className="w-full max-w-full md:w-100 h-[30vh] md:h-[80vh] overflow-x-auto hide-scrollbar md:overflow-x-visible hide-scrollbar">
          <div
            ref={scrollRef}
            className="h-full flex gap-4 pr-2 overflow-y-hidden md:block md:overflow-y-auto hide-scrollbar md:gap-0 hide-scrollbar"
          >
            {pickers}
          </div>
        </aside>

        {/* Pagination dots - only for mobile */}
        <div className="mt-3 flex justify-center gap-2 md:hidden">
          {Array.from({ length: totalDots }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                i === activeIndex ? "bg-gray-800 scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full">
        {preview}
        <div className="flex flex-1 justify-center items-center">
          <div className="mt-3 h-15 flex md:justify-center items-center">
            <button
              type="button"
              onClick={onEnquire}
              className="inline-flex items-center cursor-pointer rounded-md bg-black px-5 py-2.5 text-xl font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItemLayout;
