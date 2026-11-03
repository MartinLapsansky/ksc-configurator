"use client";

import React from "react";
import Button from "@/components/shared/Button";

type ProductFlipButtonProps = {
  isBackView: boolean;
  onToggle: () => void;
};

const ProductFlipButton: React.FC<ProductFlipButtonProps> = ({
  isBackView,
  onToggle,
}) => {
  return (
    <div className="absolute top-0.5 right-0.5 z-10 md:top-2 md:right-20">
      <Button
        type="button"
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="py-1.5"
      >
        <span
          className={`inline-block transition-transform ${
            isBackView ? "rotate-180" : ""
          }`}
        >
          ↺
        </span>
        <span>{isBackView ? "Show Front" : "Show Back"}</span>
      </Button>
    </div>
  );
};

export default ProductFlipButton;