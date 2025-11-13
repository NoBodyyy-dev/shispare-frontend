import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {ProductState, ProductInterface} from "../interfaces/product.interface.ts";
import * as actions from "../actions/product.action.ts";

export const importProductsExcelHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(actions.importProductsExcelFunc.pending, (state) => {
            state.isLoadingImportingExcel = true;
            state.importExcelError = "";
        })
        .addCase(actions.importProductsExcelFunc.rejected, (state, action) => {
            state.isLoadingImportingExcel = false;
            state.importExcelError = action.error.message || "Ошибка импорта Excel";
        })
        .addCase(actions.importProductsExcelFunc.fulfilled, (state, action) => {
            state.isLoadingImportingExcel = false;
            state.importExcelResult = action.payload.result;
        });
};

export const getProductsWithDiscountHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(actions.getProductsWithDiscountFunc.pending, (state) => {
            state.isLoadingDiscountProducts = true;
        })
        .addCase(actions.getProductsWithDiscountFunc.rejected, (state, action) => {
            state.isLoadingDiscountProducts = false;
            state.discountProductsError = action.error.message;
        })
        .addCase(actions.getProductsWithDiscountFunc.fulfilled, (state, action) => {
            state.isLoadingDiscountProducts = false;
            const products = action.payload?.products || action.payload;
            state.discountProducts = Array.isArray(products) ? products as ProductInterface[] : [];
        });
};

export const getPopularProductsHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(actions.getPopularProductsFunc.pending, (state) => {
            state.isLoadingPopularProducts = true;
        })
        .addCase(actions.getPopularProductsFunc.rejected, (state, action) => {
            state.isLoadingPopularProducts = false;
            state.popularProductsError = action.error.message;
        })
        .addCase(actions.getPopularProductsFunc.fulfilled, (state, action) => {
            state.isLoadingPopularProducts = false;
            const products = action.payload?.products || action.payload;
            state.popularProducts = Array.isArray(products) ? products as ProductInterface[] : [];
        });
};

export const getProductsByCategoriesHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(actions.getProductsByCategoryFunc.pending, (state) => {
            state.isLoadingProducts = true;
        })
        .addCase(actions.getProductsByCategoryFunc.rejected, (state, action) => {
            state.isLoadingProducts = false;
            state.productsError = action.error.message;
            // При ошибке убеждаемся, что products остается массивом
            state.products = [];
        })
        .addCase(actions.getProductsByCategoryFunc.fulfilled, (state, action) => {
            state.isLoadingProducts = false;
            console.log("handler ---", action.payload);
            state.products = action.payload.products.products as ProductInterface[];
            state.curCategory = action.payload.products.products[0]?.category?.title || "";
        });
};

export const getProductHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(actions.getProductFunc.pending, (state) => {
            state.isLoadingProduct = true;
        })
        .addCase(actions.getProductFunc.rejected, (state, action) => {
            state.isLoadingProduct = false;
            state.productError = action.error.message;
        })
        .addCase(actions.getProductFunc.fulfilled, (state, action) => {
            console.log(">>>>", action.payload);
            console.log("-----", action.payload.product)
            state.isLoadingProduct = false;
            state.currentProduct = action.payload.product as ProductInterface;
        });
};
