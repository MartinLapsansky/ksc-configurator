import { orderRequestSchema } from "@/lib/validation/orderSchema";

const validForm = {
  firstName: "John",
  lastName: "Doe",
  county: "Cork",
  email: "john@example.com",
  phoneCountryCode: "+353",
  phoneNumber: "0871234567",
  organisation: "Club",
  quantity: "12",
  message: "Hello",
};

const validProductConfig = {
  productType: "jersey",
  productName: "Jersey Design 146",
  bgColor: { id: "bg-purple", name: "Purple", hex: "#6b2bd6" },
  stripeColor: { id: "stripe-black", name: "Black", hex: "#111111" },
  brandingColor: { id: "branding-white", name: "White", hex: "#ffffff" },
};

describe("orderRequestSchema", () => {
  it("accepts a valid form with items", () => {
    const result = orderRequestSchema.safeParse({
      form: validForm,
      items: [{ quantity: 2, productConfig: validProductConfig }],
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid legacy single-product request", () => {
    const result = orderRequestSchema.safeParse({
      form: validForm,
      productConfig: validProductConfig,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a request with missing required form fields", () => {
    const result = orderRequestSchema.safeParse({
      form: { ...validForm, firstName: "" },
      items: [{ quantity: 2, productConfig: validProductConfig }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = orderRequestSchema.safeParse({
      form: { ...validForm, email: "not-an-email" },
      items: [{ quantity: 2, productConfig: validProductConfig }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a non-positive item quantity", () => {
    const result = orderRequestSchema.safeParse({
      form: validForm,
      items: [{ quantity: 0, productConfig: validProductConfig }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an unknown product type", () => {
    const result = orderRequestSchema.safeParse({
      form: validForm,
      items: [
        {
          quantity: 1,
          productConfig: { ...validProductConfig, productType: "unknown" },
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("trims and lowercases the email address", () => {
    const result = orderRequestSchema.parse({
      form: { ...validForm, email: "  JOHN@EXAMPLE.COM  " },
      items: [{ quantity: 1, productConfig: validProductConfig }],
    });

    expect(result.form.email).toBe("john@example.com");
  });
});