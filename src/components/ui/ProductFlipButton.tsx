"use client";

import React from "react";

type ProductFlipButtonProps = {
  isBackView: boolean;
  onToggle: () => void;
};

const ProductFlipButton: React.FC<ProductFlipButtonProps> = ({
  isBackView,
  onToggle,
}) => {
  return (
    <div className="mt-3 flex justify-center">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 rounded-md border border-gray-400 bg-gray-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-600"
      >
        <span
          className={`inline-block transition-transform ${
            isBackView ? "rotate-180" : ""
          }`}
        >
          ↺
        </span>
        <span>{isBackView ? "Show front" : "Show back"}</span>
      </button>
    </div>
  );
};

export default ProductFlipButton;