"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from "react";
import { getJwtToken } from "../../libs/auth";
import {
  addToCartServer,
  clearCartServer,
  getMyCartItems,
  removeCartItemServer,
  resolveCartThumbnail,
  updateCartItemQtyServer
} from "utils/services/cart";

// =================================================================================
type InitialState = { cart: CartItem[] };

export interface CartItem {
  id: string;
  productId?: string;
  cartItemId?: string;
  qty: number;
  title: string;
  slug: string;
  price: number;
  thumbnail: string;
}

interface CartActionType {
  payload?: CartItem;
  payloads?: CartItem[];
  type: "CHANGE_CART_AMOUNT" | "CLEAR_CART" | "HYDRATE_CART";
}

// =================================================================================
const INITIAL_STATE = { cart: [] };

// ==============================================================
interface ContextProps {
  state: InitialState;
  dispatch: (args: CartActionType) => void;
}
// ==============================================================

export const CartContext = createContext<ContextProps>({} as ContextProps);

const reducer = (state: InitialState, action: CartActionType) => {
  switch (action.type) {
    case "CHANGE_CART_AMOUNT":
      const cartList = state.cart;
      const cartItem = action.payload;

      if (cartItem === undefined) return state;

      const normalizedCartItem: CartItem = {
        ...cartItem,
        thumbnail: resolveCartThumbnail(cartItem.thumbnail)
      };

      const existIndex = cartList.findIndex((item) => item.id === normalizedCartItem.id);

      // REMOVE ITEM IF QUANTITY IS LESS THAN 1
      if (normalizedCartItem.qty < 1) {
        const updatedCart = cartList.filter((item) => item.id !== normalizedCartItem.id);
        return { ...state, cart: updatedCart };
      }

      // IF PRODUCT ALREADY EXITS IN CART
      if (existIndex > -1) {
        const updatedCart = [...cartList];
        updatedCart[existIndex] = {
          ...updatedCart[existIndex],
          ...normalizedCartItem,
          qty: normalizedCartItem.qty
        };
        return { ...state, cart: updatedCart };
      }

      return { ...state, cart: [...cartList, normalizedCartItem] };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "HYDRATE_CART":
      return { ...state, cart: action.payloads || [] };

    default: {
      return state;
    }
  }
};

export default function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatchLocal] = useReducer(reducer, INITIAL_STATE);
  const latestSyncIdRef = useRef(0);

  const dispatch = useCallback(
    (action: CartActionType) => {
      dispatchLocal(action);

      const token = getJwtToken();
      const isServerSyncAction =
        action.type === "CHANGE_CART_AMOUNT" || action.type === "CLEAR_CART";

      if (!token || !isServerSyncAction) return;

      const syncId = ++latestSyncIdRef.current;

      const syncWithServer = async () => {
        let result:
          | Awaited<ReturnType<typeof addToCartServer>>
          | Awaited<ReturnType<typeof updateCartItemQtyServer>>
          | Awaited<ReturnType<typeof removeCartItemServer>>
          | Awaited<ReturnType<typeof clearCartServer>>
          | null = null;

        if (action.type === "CLEAR_CART") {
          result = await clearCartServer();
        } else if (action.type === "CHANGE_CART_AMOUNT" && action.payload) {
          const payload = action.payload;
          const existingCartItem = state.cart.find((item) => item.id === payload.id);

          if (payload.qty < 1) {
            if (!existingCartItem?.cartItemId) {
              const fallback = await getMyCartItems();
              if (!fallback.success || syncId !== latestSyncIdRef.current) return;

              dispatchLocal({
                type: "HYDRATE_CART",
                payloads: fallback.items || []
              });
              return;
            }

            result = await removeCartItemServer({ cartItemId: existingCartItem.cartItemId });
          } else if (existingCartItem?.cartItemId) {
            result = await updateCartItemQtyServer({
              cartItemId: existingCartItem.cartItemId,
              quantity: payload.qty
            });
          } else {
            result = await addToCartServer({
              productId: payload.productId || payload.id,
              quantity: payload.qty
            });
          }
        }

        // Ignore out-of-order responses when users click quickly.
        if (!result || syncId !== latestSyncIdRef.current) return;

        if (result.success) {
          dispatchLocal({
            type: "HYDRATE_CART",
            payloads: result.items || []
          });
          return;
        }

        const fallback = await getMyCartItems();
        if (!fallback.success || syncId !== latestSyncIdRef.current) return;

        dispatchLocal({
          type: "HYDRATE_CART",
          payloads: fallback.items || []
        });
      };

      void syncWithServer();
    },
    [state.cart]
  );

  useEffect(() => {
    let mounted = true;

    getMyCartItems().then((result) => {
      if (!mounted || !result.success) return;

      dispatchLocal({
        type: "HYDRATE_CART",
        payloads: result.items || []
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <CartContext value={contextValue}>{children}</CartContext>;
}
