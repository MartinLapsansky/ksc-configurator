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
    <div className="mt-3 flex justify-center">
      <Button
        type="button"
        onClick={onToggle}
        variant="secondary"
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
        <span>{isBackView ? "Show front" : "Show back"}</span>
      </Button>
    </div>
  );
};

export default ProductFlipButton;