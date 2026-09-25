import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MelangeColorPicker from "@/features/configurator/components/pickers/MelangeColorPicker";
import type { MelangeColorOption } from "@/types/preview";

const solidOption: MelangeColorOption = {
  id: "solid-royal",
  name: "Royal",
  hex: "#0C4A9F",
};

const patternOption: MelangeColorOption = {
  id: "melange-royal",
  name: "Royal Melange",
  pattern: "/products/melange/royal_melange_picker.png",
};

const options: MelangeColorOption[] = [solidOption, patternOption];

describe("MelangeColorPicker", () => {
  it("renders the label and the selected option name", () => {
    render(
      <MelangeColorPicker
        label="Main Body Colour"
        valueLabel={solidOption.name}
        options={options}
        selected={solidOption}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Main Body Colour")).toBeInTheDocument();
    expect(screen.getByText("Royal")).toBeInTheDocument();
  });

  it("renders a button per option and a pattern image for melange options", () => {
    render(
      <MelangeColorPicker
        label="Main Body Colour"
        valueLabel={solidOption.name}
        options={options}
        selected={solidOption}
        onChange={() => {}}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByAltText("Royal Melange")).toBeInTheDocument();
  });

  it("calls onChange with the clicked option", () => {
    const onChange = jest.fn();

    render(
      <MelangeColorPicker
        label="Main Body Colour"
        valueLabel={solidOption.name}
        options={options}
        selected={solidOption}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByTitle("Royal Melange"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(patternOption);
  });

  it("renders a mixed solid/pattern picker without crashing when an option has hex1/hex2", () => {
    const doubleOption: MelangeColorOption = {
      id: "double",
      name: "Double",
      hex1: "#111111",
      hex2: "#ffffff",
    };

    render(
      <MelangeColorPicker
        label="Body"
        valueLabel={doubleOption.name}
        options={[doubleOption, patternOption]}
        selected={doubleOption}
        onChange={() => {}}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByAltText("Royal Melange")).toBeInTheDocument();
  });
});