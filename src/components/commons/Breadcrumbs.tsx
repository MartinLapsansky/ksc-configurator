"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBreadcrumbItems } from "@/lib/breadcrumbs";

/**
 * Breadcrumb navigation shared across the shop section.
 *
 * Uses `usePathname` so the trail stays correct on every client-side
 * navigation (including deeper segments such as product detail pages), unlike
 * a server-rendered header which goes stale inside a shared template. The last
 * crumb is highlighted with `text-lime-green` as the current page.
 */
export default function Breadcrumbs() {
  const pathname = usePathname();
  const items = getBreadcrumbItems(pathname ?? "/");

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gray-700 p-6 md:px-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;

            return (
              <li key={item.href} className="flex items-center gap-x-2">
                {isCurrent ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-lime-green"
                  >
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="font-medium transition-colors text-white hover:text-lime-green"
                    >
                      {item.label}
                    </Link>

                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}