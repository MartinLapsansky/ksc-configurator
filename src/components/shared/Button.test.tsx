import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renders as a button by default", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls the click handler when clicked", () => {
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Save</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports native button attributes such as disabled and type", () => {
    render(
      <Button type="submit" disabled>
        Submit
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
  });

  it("renders a link when href is provided", () => {
    render(<Button href="/checkout">Checkout</Button>);

    const link = screen.getByRole("link", { name: "Checkout" });
    expect(link).toHaveAttribute("href", "/checkout");
  });

  it("applies the unified 35px corner radius", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "rounded-[35px]",
    );
  });
});