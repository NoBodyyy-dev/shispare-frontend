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
            state.popularProductsError = action.error?.message || "Ошибка загрузки популярных товаров";
            console.error("getPopularProductsFunc rejected:", action.error, action.payload);
            // При ошибке устанавливаем пустой массив
            state.popularProducts = [];
        })
        .addCase(actions.getPopularProductsFunc.fulfilled, (state, action) => {
            state.isLoadingPopularProducts = false;
            console.log("getPopularProductsFunc fulfilled:", action.payload);
            // Бэкенд возвращает { success: true, products: [...] }
            const products = action.payload?.products || action.payload;
            state.popularProducts = Array.isArray(products) ? products as ProductInterface[] : [];
            console.log("popularProducts after handler:", state.popularProducts);
        })
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
            const products = action.payload.products as ProductInterface[];
            state.products = products;
            state.curCategory = products[0]?.category?.title || "";
        });
};

export const getBestRatingProductsHandler = (
    builder: ActionReducerMapBuilder<ProductState>
) => {
    builder
        .addCase(actions.getProductsByBestRatingFunc.pending, (state) => {
            state.isLoadingBestRatingProducts = true;
        })
        .addCase(actions.getProductsByBestRatingFunc.rejected, (state, action) => {
            state.isLoadingBestRatingProducts = false;
            state.bestRatingProductsError = action.error?.message || "Ошибка загрузки товаров";
            state.bestRatingProducts = [];
        })
        .addCase(actions.getProductsByBestRatingFunc.fulfilled, (state, action) => {
            state.isLoadingBestRatingProducts = false;
            const products = action.payload?.products || action.payload;
            state.bestRatingProducts = Array.isArray(products) ? products as ProductInterface[] : [];
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
