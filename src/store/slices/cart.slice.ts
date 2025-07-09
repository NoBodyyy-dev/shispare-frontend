import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductInterface } from "../interfaces/product.interface";

const calculateCartTotals = (cart: Record<string, { product: ProductInterface, count: number }>) => {
    console.log(cart);
    const products = Object.values(cart);
    console.log(products);
    const totalPrice = 0
        //products.reduce((sum, data) => sum + data.product.price! * data.count, 0);
    const discount = 0
        // products.reduce((sum, data) => sum + (data.product.price! * data.product.discount! / 100) * data.count, 0);
    const priceWithDiscount = totalPrice - discount;
    const totalProducts = products.length;

    return { totalPrice, discount, priceWithDiscount, totalProducts };
};

const savedCart = JSON.parse(localStorage.getItem("cart")!) || {};

const initialState = {
    cart: savedCart,
    ...calculateCartTotals(savedCart)
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ProductInterface>) => {
            const id: string = action.payload._id!;
            if (state.cart[id]) {
                state.cart[id].count += 1;
            } else {
                state.cart[id] = { product: action.payload, count: 1 };
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
            Object.assign(state, calculateCartTotals(state.cart));
        },
        decreaseQuantity: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            if (state.cart[id]) {
                if (state.cart[id].count > 1) {
                    state.cart[id].count -= 1;
                } else {
                    delete state.cart[id];
                }
                localStorage.setItem("cart", JSON.stringify(state.cart));
                Object.assign(state, calculateCartTotals(state.cart));
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            delete state.cart[action.payload];
            localStorage.setItem("cart", JSON.stringify(state.cart));
            Object.assign(state, calculateCartTotals(state.cart));
        },
        clearCart: (state) => {
            state.cart = {};
            localStorage.removeItem("cart");
            Object.assign(state, {
                totalPrice: 0,
                discount: 0,
                priceWithDiscount: 0,
                totalProducts: 0
            });
        },
    },
});

export default cartSlice.reducer;