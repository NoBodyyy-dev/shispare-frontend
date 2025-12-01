// store.ts
import {configureStore} from "@reduxjs/toolkit";
import productSlice from "./slices/product.slice.ts";
import userSlice from "./slices/user.slice.ts";
import categorySlice from "./slices/category.slice.ts";
import stockSlice from "./slices/stock.slice.ts";
import blogSlice from "./slices/blog.slice.ts";
import cartSlice from "./slices/cart.slice.ts";
import pushSlice from "./slices/push.slice.ts";
import socketSlice from "./slices/socket.slice.ts";
import orderSlice from "./slices/order.slice.ts";
import commentSlice from "./slices/comment.slice.ts";
import requestSlice from "./slices/request.slice.ts";
import solutionSlice from "./slices/solution.slice.ts";

export const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
    reducer: {
        product: productSlice,
        user: userSlice,
        category: categorySlice,
        stock: stockSlice,
        socket: socketSlice,
        blog: blogSlice,
        cart: cartSlice,
        push: pushSlice,
        order: orderSlice,
        comment: commentSlice,
        request: requestSlice,
        solution: solutionSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

if (typeof window !== 'undefined') {
    (window as any).__store__ = store;
}