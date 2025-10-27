import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState } from "../interfaces/cart.interface";
import { CartProductInterface, ProductInterface } from "../interfaces/product.interface";
import { getCart, addToCart, updateQuantity, removeFromCart, clearCart } from "../actions/cart.action.ts";
import { debounce } from "../../hooks/util.hook";

const CART_KEY = "cart";
const DEBOUNCE_DELAY = 2000;

// ─────────────────────────────
// localStorage helpers
// ─────────────────────────────
const loadLocal = (): CartProductInterface[] => {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
        return [];
    }
};

const saveLocal = (items: CartProductInterface[]) => {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
        localStorage.setItem(CART_KEY, JSON.stringify([]));
    }
};

const recalcTotals = (state: CartState) => {
    let total = 0;
    let count = 0;

    for (const item of state.products) {
        const variant = item.product?.variants?.find(v => v.article === item.article);
        if (!variant) continue;
        total += variant.price * item.quantity;
        count += item.quantity;
    }

    state.totalAmount = total;
    state.discountAmount = 0;
    state.finalAmount = total;
    state.totalProducts = count;
};

const upsertItem = (
    items: CartProductInterface[],
    product: ProductInterface,
    article: number,
    quantity: number
) => {
    const idx = items.findIndex(i => i.product._id === product._id && i.article === article);

    if (quantity <= 0) {
        if (idx >= 0) items.splice(idx, 1);
        return;
    }

    if (idx >= 0) {
        items[idx].quantity = quantity;
    } else {
        items.push({
            _id: crypto.randomUUID?.() || `${product._id}-${article}-${Date.now()}`,
            product,
            article,
            quantity,
            addedAt: new Date(),
        });
    }
};

const initialState: CartState = {
    products: loadLocal(),
    totalAmount: 0,
    discountAmount: 0,
    totalProducts: 0,
    finalAmount: 0,
    isLoading: false,
    error: "",
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setQuantityLocal: (
            state,
            action: PayloadAction<{
                product: ProductInterface;
                article: number;
                quantity: number;
            }>
        ) => {
            const { product, article, quantity } = action.payload;
            upsertItem(state.products, product, article, Math.max(0, quantity));
            recalcTotals(state);
            saveLocal(state.products);
        },
        clearCartLocal: (state) => {
            state.products = [];
            recalcTotals(state);
            saveLocal([]);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCart.fulfilled, (state, action) => {
                state.products = action.payload.products || [];
                recalcTotals(state);
                saveLocal(state.products);
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.products = [];
                recalcTotals(state);
                saveLocal([]);
            });
    },
});

export const { setQuantityLocal, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;

import { AppDispatch } from "../store"; // тип вашего dispatch

export const setQuantitySmart = (() => {
    const debounced = new Map<string, ReturnType<typeof debounce>>();

    return ({
                dispatch,
                product,
                article,
                quantity,
                isAuthenticated,
                prevQuantity,
            }: {
        dispatch: AppDispatch;
        product: ProductInterface;
        article: number;
        quantity: number;
        isAuthenticated: boolean;
        prevQuantity: number;
    }) => {
        // мгновенное обновление UI
        dispatch(setQuantityLocal({ product, article, quantity }));

        // гость → только localStorage
        if (!isAuthenticated) return;

        // debounce key
        const key = `${product._id}:${article}`;
        if (debounced.has(key)) debounced.get(key)?.cancel();

        const action = debounce(async () => {
            try {
                if (quantity <= 0) {
                    await dispatch(removeFromCart({ productId: product._id, article })).unwrap();
                } else if (prevQuantity <= 0) {
                    await dispatch(addToCart({ productId: product._id, article, quantity })).unwrap();
                } else {
                    await dispatch(updateQuantity({ productId: product._id, article, quantity })).unwrap();
                }
            } catch {
                // rollback
                dispatch(setQuantityLocal({ product, article, quantity: prevQuantity }));
            }
        }, DEBOUNCE_DELAY);

        debounced.set(key, action);
        action();
    };
})();