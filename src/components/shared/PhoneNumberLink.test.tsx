import { render, screen } from "@testing-library/react";
import PhoneNumberLink from "./PhoneNumberLink";

describe("PhoneNumberLink", () => {
  it("renders a clickable tel: link with an international formatted label", () => {
    render(<PhoneNumberLink dialCode="+421" national="987564765" />);

    const link = screen.getByRole("link", { name: "+421 987 564 765" });
    expect(link).toHaveAttribute("href", "tel:+421987564765");
  });

  it("renders a plain span when there is no phone number", () => {
    const { container } = render(
      <PhoneNumberLink dialCode="+421" national="" />,
    );

    expect(container.querySelector("a")).toBeNull();
    expect(container.textContent).toBe("");
  });
});