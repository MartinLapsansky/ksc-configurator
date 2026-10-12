import React from "react";
import { renderHook, act } from "@testing-library/react";
import type { ProductConfig } from "@/types/preview";
import { CartProvider, useCart } from "@/contexts/CartContext";

const baseConfig: ProductConfig = {
  productType: "jersey",
  productName: "Jersey Design 146",
  bgColor: { id: "bg-purple", name: "Purple", hex: "#6b2bd6" },
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("useCart", () => {
  it("initializes with an empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalQuantity).toBe(0);
  });

  it("adds a new item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(baseConfig);
    });

    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalQuantity).toBe(1);
  });

  it("merges duplicate configs into a single item with quantity 2", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(baseConfig);
      result.current.addItem(baseConfig);
    });

    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalQuantity).toBe(2);
  });

  it("keeps distinct configs as separate items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(baseConfig);
      result.current.addItem({ ...baseConfig, bgColor: { id: "bg-pink", name: "Pink", hex: "#e4007f" } });
    });

    expect(result.current.totalItems).toBe(2);
  });

  it("updates quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(baseConfig);
    });

    const id = result.current.items[0].id;

    act(() => {
      result.current.setQuantity(id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalQuantity).toBe(5);
  });

  it("removes an item when quantity drops to zero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(baseConfig);
    });

    const id = result.current.items[0].id;

    act(() => {
      result.current.setQuantity(id, 0);
    });

    expect(result.current.totalItems).toBe(0);
  });

  it("removes an item by id", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(baseConfig);
    });

    const id = result.current.items[0].id;

    act(() => {
      result.current.removeItem(id);
    });

    expect(result.current.totalItems).toBe(0);
  });

  it("clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(baseConfig);
      result.current.addItem({ ...baseConfig, productName: "Other" });
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
  });

  it("throws when used outside the provider", () => {
    // Suppress the expected React error output for this assertion.
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used within CartProvider",
    );

    spy.mockRestore();
  });
});