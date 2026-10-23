import {
  formatPhone,
  splitNationalFromE164,
  toE164,
  toTelHref,
} from "./formatPhone";

describe("toE164", () => {
  it("joins a dial code and national number", () => {
    expect(toE164({ dialCode: "+353", national: "871234567" })).toBe(
      "+353871234567",
    );
  });

  it("normalises a dial code without a leading plus", () => {
    expect(toE164({ dialCode: "421", national: "987564765" })).toBe(
      "+421987564765",
    );
  });

  it("strips non-digit characters from the national number", () => {
    expect(toE164({ dialCode: "+421", national: "987 564 765" })).toBe(
      "+421987564765",
    );
  });

  it("returns an empty string when parts are missing", () => {
    expect(toE164({ dialCode: "+421", national: "" })).toBe("");
    expect(toE164({ dialCode: "", national: "987564765" })).toBe("");
  });
});

describe("formatPhone", () => {
  it("formats an Irish number", () => {
    expect(formatPhone({ dialCode: "+353", national: "871234567" })).toBe(
      "+353 87 123 4567",
    );
  });

  it("formats a Slovak number", () => {
    expect(formatPhone({ dialCode: "+421", national: "987564765" })).toBe(
      "+421 987 564 765",
    );
  });

  it("formats a US number", () => {
    expect(formatPhone({ dialCode: "+1", national: "2015550123" })).toBe(
      "+1 201 555 0123",
    );
  });

  it("falls back to raw parts when parsing fails", () => {
    expect(formatPhone({ dialCode: "+999", national: "12345" })).toBe(
      "+999 12345",
    );
  });

  it("returns an empty string for empty parts", () => {
    expect(formatPhone({ dialCode: "", national: "" })).toBe("");
  });
});

describe("toTelHref", () => {
  it("builds a tel: href", () => {
    expect(toTelHref({ dialCode: "+421", national: "987564765" })).toBe(
      "tel:+421987564765",
    );
  });

  it("returns an empty string when parts are empty", () => {
    expect(toTelHref({ dialCode: "", national: "" })).toBe("");
  });
});

describe("splitNationalFromE164", () => {
  it("removes the dial code prefix", () => {
    expect(splitNationalFromE164("353871234567", "353")).toBe("871234567");
  });

  it("keeps the full value when the dial code does not prefix it", () => {
    expect(splitNationalFromE164("421987564765", "353")).toBe("421987564765");
  });

  it("returns digits only when dial code is empty", () => {
    expect(splitNationalFromE164("+421 987 564 765", "")).toBe("421987564765");
  });

  it("strips non-digit characters from the value", () => {
    expect(splitNationalFromE164("353-87-123-4567", "353")).toBe("871234567");
  });
});