import { render, screen, fireEvent } from "@testing-library/react";
import PhoneInput from "./PhoneInput";

describe("PhoneInput", () => {
  it("renders a tel input with an accessible label", () => {
    render(
      <PhoneInput
        countryCode="+353"
        phoneNumber=""
        onChangeAction={jest.fn()}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Phone number" })).toHaveAttribute(
      "type",
      "tel",
    );
  });

  it("splits the dial code and national number on change", () => {
    const onChangeAction = jest.fn();

    render(
      <PhoneInput
        countryCode="+353"
        phoneNumber=""
        onChangeAction={onChangeAction}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Phone number" }), {
      target: { value: "+353871234567" },
    });

    expect(onChangeAction).toHaveBeenCalledWith({
      phoneCountryCode: "+353",
      phoneNumber: "871234567",
    });
  });
});