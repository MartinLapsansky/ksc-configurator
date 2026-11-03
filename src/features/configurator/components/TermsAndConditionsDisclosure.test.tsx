import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TermsAndConditionsDisclosure from "@/features/configurator/components/TermsAndConditionsDisclosure";

describe("TermsAndConditionsDisclosure", () => {
  it("is collapsed by default", () => {
    render(<TermsAndConditionsDisclosure />);

    expect(
      screen.getByRole("button", { name: /terms/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("expands and collapses when the toggle is clicked", () => {
    render(<TermsAndConditionsDisclosure />);

    const toggle = screen.getByRole("button", { name: /terms/i });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("links the toggle to the content region", () => {
    render(<TermsAndConditionsDisclosure />);

    const toggle = screen.getByRole("button", { name: /terms/i });
    const panelId = toggle.getAttribute("aria-controls");

    expect(panelId).toBeTruthy();
    if (panelId) {
      expect(document.getElementById(panelId)).toBeInTheDocument();
    }
  });
});
