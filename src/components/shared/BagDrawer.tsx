"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faMinus,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";
import { PRODUCT_TYPE_LABELS, getThumbnail } from "@/lib/cart";

export default function BagDrawer() {
  const { items, totalItems, isBagOpen, closeBag, setQuantity, removeItem } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeBag}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isBagOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="My bag"
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out sm:w-3/4 md:w-1/4 ${
          isBagOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
          <h2 className="text-2xl font-bold tracking-tight text-black">
            My bag
          </h2>
          <button
            type="button"
            aria-label="Close bag"
            onClick={closeBag}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <p className="border-b border-gray-100 px-5 py-3 text-sm text-green-700">
          Item successfully added to cart
        </p>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-5 text-center">
            <FontAwesomeIcon
              icon={faBagShopping}
              className="h-14 w-14 text-gray-300"
            />
            <p className="text-gray-600">Your bag is empty.</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
            {items.map((item) => {
              const thumbnail = getThumbnail(item.config);

              return (
                <li key={item.id} className="flex items-center gap-3 py-4">
                  {thumbnail ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                      <Image
                        src={thumbnail}
                        alt={item.config.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400">
                      <FontAwesomeIcon icon={faBagShopping} className="h-5 w-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-black">
                      {PRODUCT_TYPE_LABELS[item.config.productType]}
                    </p>
                    {item.config.bgColor?.name && (
                      <p className="truncate text-xs text-gray-500">
                        {item.config.bgColor.name}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                      </button>

                      <span className="w-5 text-center text-sm font-medium text-black tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          setQuantity(item.id, item.quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${item.config.productName}`}
                    onClick={() => removeItem(item.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="border-t border-gray-200 p-5">
          <p className="mb-4 text-base font-semibold text-black">
            Total items: {totalItems}
          </p>
          <Link
            href="/checkout"
            onClick={closeBag}
            className="inline-flex w-full items-center justify-center rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gray-600"
          >
            View bag and checkout
          </Link>
        </div>
      </aside>
    </>
  );
}