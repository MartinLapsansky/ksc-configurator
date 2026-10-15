import validateCredentials, {
  validateEmail,
} from "@/features/auth/utils/validateCredentials";

describe("validatePassword", () => {
  it("returns null for a valid password", () => {
    expect(validateCredentials("Password1")).toBeNull();
  });

  it("rejects passwords shorter than 8 characters", () => {
    expect(validateCredentials("Pass1")).toBe(
      "Password must be at least 8 characters long",
    );
  });

  it("rejects passwords without an uppercase letter", () => {
    expect(validateCredentials("password1")).toBe(
      "Password must contain at least one uppercase letter",
    );
  });

  it("rejects passwords without a number", () => {
    expect(validateCredentials("Password")).toBe(
      "Password must contain at least one number",
    );
  });

  it("validates an 8-character password with uppercase and digit", () => {
    expect(validateCredentials("Abcdefg1")).toBeNull();
  });
});

describe("validateEmail", () => {
  it("accepts a valid email address", () => {
    expect(validateEmail("john@example.com")).toBe(true);
  });

  it("accepts an email with subdomains", () => {
    expect(validateEmail("john.doe@mail.example.co.uk")).toBe(true);
  });

  it("rejects an email without an @ symbol", () => {
    expect(validateEmail("john.example.com")).toBe(false);
  });

  it("rejects an email without a domain", () => {
    expect(validateEmail("john@")).toBe(false);
  });

  it("rejects an email without a top-level domain", () => {
    expect(validateEmail("john@example")).toBe(false);
  });

  it("rejects an email with spaces", () => {
    expect(validateEmail("john @example.com")).toBe(false);
  });
});
