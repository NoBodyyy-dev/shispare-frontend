// import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
// import { CartState } from "../interfaces/cart.interface";
// import { deleteItemFunc, loadCartFunc, updateQuantityFunc } from "../actions/cart.action";
//
// // Загрузка корзины
// export const loadCartHandler = (builder: ActionReducerMapBuilder<CartState>) => {
//     builder
//         .addCase(loadCartFunc.pending, (state) => {
//             state.isLoadingCart = true;
//             state.errorCart = "";
//         })
//         .addCase(loadCartFunc.fulfilled, (state, action) => {
//             state.isLoadingCart = false;
//             state.products = action.payload.products;
//             state.totalAmount = action.payload.totalAmount;
//             state.discountAmount = action.payload.discountAmount;
//             state.finalAmount = action.payload.finalAmount;
//             state.vatAmount = action.payload.vatAmount;
//         })
//         .addCase(loadCartFunc.rejected, (state, action) => {
//             state.isLoadingCart = false;
//             state.errorCart = action.payload as string || action.error.message || "Ошибка загрузки корзины";
//         });
// };
//
// // Обновление количества
// export const updateQuantityHandler = (builder: ActionReducerMapBuilder<CartState>) => {
//     builder
//         .addCase(updateQuantityFunc.pending, (state) => {
//             state.isLoadingUpdateQuantity = true;
//             state.errorUpdateQuantity = "";
//         })
//         .addCase(updateQuantityFunc.fulfilled, (state, action) => {
//             state.isLoadingUpdateQuantity = false;
//             state.products = action.payload.products;
//             state.totalAmount = action.payload.totalAmount;
//             state.discountAmount = action.payload.discountAmount;
//             state.finalAmount = action.payload.finalAmount;
//             state.vatAmount = action.payload.vatAmount;
//         })
//         .addCase(updateQuantityFunc.rejected, (state, action) => {
//             state.isLoadingUpdateQuantity = false;
//             state.errorUpdateQuantity = action.payload as string || action.error.message || "Ошибка обновления количества";
//         });
// };
//
// // Удаление товара
// export const deleteItemHandler = (builder: ActionReducerMapBuilder<CartState>) => {
//     builder
//         .addCase(deleteItemFunc.fulfilled, (state, action) => {
//             state.products = action.payload.products;
//             state.totalAmount = action.payload.totalAmount;
//             state.discountAmount = action.payload.discountAmount;
//             state.finalAmount = action.payload.finalAmount;
//             state.vatAmount = action.payload.vatAmount;
//         })
//         .addCase(deleteItemFunc.rejected, (state, action) => {
//             state.errorCart = action.payload as string || action.error.message || "Ошибка удаления товара";
//         });
// };