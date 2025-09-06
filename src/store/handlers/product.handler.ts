import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {ProductState} from "../interfaces/product.interface.ts";
import * as actions from "../actions/product.action.ts";

export const getProductsWithDiscountHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(
            actions.getProductsWithDiscountFunc.pending,
            (state: ProductState) => {
                state.isLoadingDiscountProducts = true;
            }
        )
        .addCase(
            actions.getProductsWithDiscountFunc.rejected,
            (state: ProductState, action) => {
                state.isLoadingDiscountProducts = false;
                state.discountProductsError = action.error.message;
                console.log(action);
            }
        )
        .addCase(
            actions.getProductsWithDiscountFunc.fulfilled,
            (state: ProductState, action) => {
                state.isLoadingDiscountProducts = false;
                state.discountProducts = action.payload.products;
            }
        );
};

export const getPopularProductsHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(actions.getPopularProductsFunc.pending, (state: ProductState) => {
            state.isLoadingPopularProducts = true;
        })
        .addCase(actions.getPopularProductsFunc.rejected, (state: ProductState) => {
            state.isLoadingPopularProducts = false;
        })
        .addCase(
            actions.getPopularProductsFunc.fulfilled,
            (state: ProductState, action) => {
                state.isLoadingPopularProducts = false;
                state.popularProducts = action.payload.products;
            }
        );
};

export const getProductsByCategoriesHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(
            actions.getProductsByCategoryFunc.pending,
            (state: ProductState) => {
                state.isLoadingProducts = true;
            }
        )
        .addCase(
            actions.getProductsByCategoryFunc.rejected,
            (state: ProductState, action) => {
                state.isLoadingProducts = false;
                state.productsError = action.error.message;
                console.log(action.error.message);
            }
        )
        .addCase(
            actions.getProductsByCategoryFunc.fulfilled,
            (state: ProductState, action) => {
                state.isLoadingProducts = false;
                console.log(action.payload);
                state.products = action.payload.products;
                state.curCategory = action.payload.products[0].category.title;
            }
        );
};

export const getProductHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(actions.getProductFunc.pending, (state: ProductState) => {
            state.isLoadingProduct = true;
        })
        .addCase(actions.getProductFunc.rejected, (state: ProductState, action) => {
            state.isLoadingProduct = false;
            state.productError = action.error.message;
        })
        .addCase(actions.getProductFunc.fulfilled, (state: ProductState, action) => {
            state.isLoadingProduct = false;
            console.log(action.payload);
            state.currentProduct = action.payload.product;
        })
};