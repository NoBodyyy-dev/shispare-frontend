import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CartState} from "../interfaces/cart.interface.ts";
import {addToCart, clearCart, getCart, removeFromCart, updateQuantity} from "../actions/cart.action.ts";

const initialState: CartState = {
    products: [],
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
        updateQuantityLocal: (state, action: PayloadAction<{
            productId: string;
            quantity: number
        }>) => {
            const {productId, quantity} = action.payload;
            const product = state.products.find(
                (p) => p.product._id === productId
            );
            if (product) {
                product.quantity = quantity;

                // Пересчитываем суммы локально
                state.totalAmount = state.products.reduce((total, item) => {
                    const price = item.product.variants?.[item.product.variantIndex || 0]?.price || 0;
                    return total + (price * item.quantity);
                }, 0);

                // Здесь можно добавить логику для discount, vat и final amount
                state.finalAmount = state.totalAmount - state.discountAmount;
            }
        },

        rollbackQuantity: (state, action: PayloadAction<{
            productId: string;
            prevQuantity: number
        }>) => {
            const {productId, prevQuantity} = action.payload;
            const product = state.products.find(
                (p) => p.product._id === productId
            );
            if (product) {
                product.quantity = prevQuantity;

                // Пересчитываем суммы после отката
                state.totalAmount = state.products.reduce((total, item) => {
                    const price = item.product.variants?.[item.product.variantIndex || 0]?.price || 0;
                    return total + (price * item.quantity);
                }, 0);

                state.finalAmount = state.totalAmount - state.discountAmount;
            }
        },

        removeItemLocal: (state, action: PayloadAction<{ productId: string }>) => {
            state.products = state.products.filter(
                (p) => p.product._id !== action.payload.productId
            );

            // Пересчитываем суммы после удаления
            state.totalAmount = state.products.reduce((total, item) => {
                const price = item.product.variants?.[item.product.variantIndex || 0]?.price || 0;
                return total + (price * item.quantity);
            }, 0);

            state.finalAmount = state.totalAmount - state.discountAmount;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Cart - полная синхронизация с сервером
            .addCase(getCart.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.products = action.payload.products;
                state.totalAmount = action.payload.totalAmount;
                state.discountAmount = action.payload.discountAmount;
                state.finalAmount = action.payload.finalAmount;
                state.totalProducts = action.payload.totalProducts;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = (action.payload as string) || action.error.message || "Ошибка получения корзины";
            })

            // Add to Cart - полная синхронизация
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.products = action.payload.products;
                state.totalAmount = action.payload.totalAmount;
                state.discountAmount = action.payload.discountAmount;
                state.finalAmount = action.payload.finalAmount;
                state.totalProducts = action.payload.totalProducts;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = (action.payload as string) || action.error.message || "Ошибка добавления в корзину";
            })

            // Update Quantity - ТОЛЬКО обновляем суммы, продукты уже обновлены оптимистично
            .addCase(updateQuantity.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                // Не перезаписываем продукты, только суммы
                state.totalAmount = action.payload.totalAmount;
                state.discountAmount = action.payload.discountAmount;
                state.finalAmount = action.payload.finalAmount;
                state.totalProducts = action.payload.totalProducts;
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = (action.payload as string) || action.error.message || "Ошибка обновления количества";
            })

            // Remove from Cart - полная синхронизация
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.products = action.payload.products;
                state.totalAmount = action.payload.totalAmount;
                state.discountAmount = action.payload.discountAmount;
                state.finalAmount = action.payload.finalAmount;
                state.totalProducts = action.payload.totalProducts;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = (action.payload as string) || action.error.message || "Ошибка удаления из корзины";
            })

            // Clear Cart - полная синхронизация
            .addCase(clearCart.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.products = action.payload.products;
                state.totalAmount = action.payload.totalAmount;
                state.discountAmount = action.payload.discountAmount;
                state.finalAmount = action.payload.finalAmount;
                state.totalProducts = action.payload.totalProducts;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = (action.payload as string) || action.error.message || "Ошибка очистки корзины";
            });
    }
});

export const {updateQuantityLocal, rollbackQuantity, removeItemLocal} = cartSlice.actions;
export default cartSlice.reducer;