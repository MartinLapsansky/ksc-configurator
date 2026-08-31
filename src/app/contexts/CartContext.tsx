"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { CartItem, ProductConfig } from "@/types/preview";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "addItem"; config: ProductConfig }
  | { type: "removeItem"; id: string }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "clearCart" };

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  addItem: (config: ProductConfig) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Two configs are considered equal when their serialised values match. This
 * lets "adding the same product twice" merge into one line item.
 */
function configKey(config: ProductConfig): string {
  return JSON.stringify(config);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "addItem": {
      const key = configKey(action.config); // actual config 
      const existing = state.items.find( // find config from all items where config of this item = actual config 
        (item) => configKey(item.config) === key,
      );

      if (existing) { //if exists this config then update items in carts weith adding same item and raise the quantity
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return { //else generate new item into items with unique id and addItem config
        ...state,
        items: [
          ...state.items,
          { id: generateId(), quantity: 1, config: action.config },
        ],
      };
    }

    case "removeItem":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };

    case "setQuantity": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, quantity: action.quantity }
            : item,
        ),
      };
    }

    case "clearCart":
      return { items: [] };

    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.length;
    const totalQuantity = state.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return {
      items: state.items,
      totalItems,
      totalQuantity,
      addItem: (config) => dispatch({ type: "addItem", config }),
      removeItem: (id) => dispatch({ type: "removeItem", id }),
      setQuantity: (id, quantity) =>
        dispatch({ type: "setQuantity", id, quantity }),
      clearCart: () => dispatch({ type: "clearCart" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};