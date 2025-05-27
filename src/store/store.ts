import {configureStore} from "@reduxjs/toolkit";
import productSlice from "./slices/product.slice.ts";
import userSlice from "./slices/user.slice.ts";
import categorySlice from "./slices/category.slice.ts";
import stockSlice from "./slices/stock.slice.ts";
import blogSlice from "./slices/blog.slice.ts";
import cartSlice from "./slices/cart.slice.ts";
import pushSlice from "./slices/push.slice.ts";

export const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
    }),
    reducer: {
        product: productSlice,
        user: userSlice,
        category: categorySlice,
        stock: stockSlice,
        blog: blogSlice,
        cart: cartSlice,
        push: pushSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;