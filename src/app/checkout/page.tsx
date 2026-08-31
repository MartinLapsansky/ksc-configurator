"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/app/contexts/CartContext";
import type { ProductConfig } from "@/types/preview";

const PRODUCT_TYPE_LABELS: Record<ProductConfig["productType"], string> = {
  jersey: "Jersey",
  halfZip: "Half Zip",
  crewNeck: "Crew Neck",
};

function getThumbnail(config: ProductConfig): string | null {
  const file = config.bgColor?.file;
  if (!file) return null;
  if (typeof file === "string") return file;
  return file.src ?? null;
}

export default function CheckoutPage() {
  const { items, totalItems, setQuantity, removeItem } = useCart();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Checkout{" "}
            <span className="text-gray-500">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h1>

          <FontAwesomeIcon icon={faBagShopping} className="h-7 w-7 text-black" />
        </div>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
            <FontAwesomeIcon
              icon={faBagShopping}
              className="h-16 w-16 text-gray-300"
            />
            <p className="text-lg text-gray-600">Your bag is empty.</p>
            <Link
              href="/sportswear/jerseys"
              className="inline-flex items-center rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
            >
              Continue browsing
            </Link>
          </div>
        ) : (
          <>
            {/* Header row (hidden on mobile) */}
            <div className="mt-8 hidden grid-cols-[1.4fr_1fr_auto_1fr_auto] gap-4 border-b border-gray-200 pb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 md:grid">
              <span>Product</span>
              <span>Name</span>
              <span className="text-center">Quantity</span>
              <span></span>
            </div>

            <ul className="divide-y divide-gray-100">
              {items.map((item) => {
                const thumbnail = getThumbnail(item.config);

                return (
                  <li
                    key={item.id}
                    className="grid grid-cols-1 items-center gap-4 py-5 md:grid-cols-[1.4fr_1fr_auto_1fr_auto]"
                  >
                    {/* Produkt */}
                    <div className="flex items-center gap-4">
                      {thumbnail ? (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                          <Image
                            src={thumbnail}
                            alt={item.config.productName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400">
                          <FontAwesomeIcon icon={faBagShopping} className="h-6 w-6" />
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-black">
                          {PRODUCT_TYPE_LABELS[item.config.productType]}
                        </p>
                        {item.config.bgColor?.name && (
                          <p className="text-sm text-gray-500">
                            {item.config.bgColor.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Názov */}
                    <div>
                      <p className="font-semibold text-black">
                        {item.config.productName}
                      </p>
                    </div>

                    {/* Množstvo */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                      </button>

                      <span className="w-6 text-center text-base font-medium text-black tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Delete */}
                    <div className="flex justify-end md:justify-center">
                      <button
                        type="button"
                        aria-label={`Remove ${item.config.productName}`}
                        onClick={() => removeItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col items-end gap-4 border-t border-gray-200 pt-6">
              <Link
                href="/enquire"
                className="inline-flex items-center justify-center rounded-md bg-black px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gray-600"
              >
                Enquiry
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}