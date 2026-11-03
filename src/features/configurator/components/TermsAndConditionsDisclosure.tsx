"use client";

import React, {useEffect, useId, useRef, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { TERMS_AND_CONDITIONS_PARAGRAPHS } from "@/features/configurator/constants";

/**
 * Collapsible "Terms & Conditions" disclosure shown under the Submit button.
 * Owns its open/closed state and animates the panel with a CSS grid-rows
 * transition so the text "rolls out" smoothly without an animation library.
 */
export default function TermsAndConditionsDisclosure() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {

        if (!isOpen) return;

        const timeout = setTimeout(() => {
            panelRef.current?.scrollIntoView({behavior: "smooth", block: "nearest"})
        }, 300)

        return () => clearTimeout(timeout)

    },[isOpen])

  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 underline-offset-4 transition-colors hover:text-black hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Terms &amp; Conditions
          <FontAwesomeIcon
              icon={faChevronDown}
              className={`h-3 w-3 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
              }`}
          />
      </button>

      <div
        id={panelId}
        ref={panelRef}
        className={`w-full grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700">
            {TERMS_AND_CONDITIONS_PARAGRAPHS.map((paragraph, index) => (
              <li key={index} className="mb-3 ml-2 last:mb-0">
                {paragraph}
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
