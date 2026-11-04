"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { CartItem, ProductConfig } from "@/types/preview";

const CART_STORAGE_KEY = "cart:items";

type CartState = {
  items: CartItem[];
  /** Becomes true once the client has hydrated from localStorage. */
  hydrated: boolean;
};

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "addItem"; config: ProductConfig }
  | { type: "removeItem"; id: string }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "clearCart" };

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  isBagOpen: boolean;
  addItem: (config: ProductConfig) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openBag: () => void;
  closeBag: () => void;
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

/**
 * Reads persisted cart items from `localStorage`. Returns an empty array when
 * storage is unavailable (SSR) or the stored value is missing/corrupt.
 */
function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is CartItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.quantity === "number" &&
        item.config !== null &&
        typeof item.config === "object",
    );
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be unavailable (private mode / quota). The cart still works
    // in memory for the current session.
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };

    case "addItem": {
      const key = configKey(action.config);
      const existing = state.items.find(
        (item) => configKey(item.config) === key,
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
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
      return { ...state, items: [] };

    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    hydrated: false,
  });
  const [isBagOpen, setIsBagOpen] = useState(false);

  // Hydrate the cart from localStorage once on the client. This runs in an
  // effect (rather than a lazy initializer) so the server-rendered HTML always
  // matches the initial client render and there is no hydration mismatch.
  useEffect(() => {
    dispatch({ type: "hydrate", items: readStoredCart() });
  }, []);

  // Persist cart changes back to localStorage, but only after hydration so we
  // never overwrite stored items with the empty initial state.
  useEffect(() => {
    if (state.hydrated) {
      writeStoredCart(state.items);
    }
  }, [state.items, state.hydrated]);

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
      isBagOpen,
      addItem: (config) => dispatch({ type: "addItem", config }),
      removeItem: (id) => dispatch({ type: "removeItem", id }),
      setQuantity: (id, quantity) =>
        dispatch({ type: "setQuantity", id, quantity }),
      clearCart: () => dispatch({ type: "clearCart" }),
      openBag: () => setIsBagOpen(true),
      closeBag: () => setIsBagOpen(false),
    };
  }, [state.items, isBagOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};