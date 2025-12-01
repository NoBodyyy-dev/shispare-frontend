import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {ProductState} from "../interfaces/product.interface.ts";
import * as handler from "../handlers/product.handler.ts";

const initialState: ProductState = {
    products: [],
    discountProducts: [],
    popularProducts: [],
    bestRatingProducts: [],
    categoryProducts: [],
    currentProduct: null,
    curCategory: "",
    importExcelResult: null,
    // состояния загрузки
    isLoadingImportingExcel: false,
    isLoadingProducts: false,
    isLoadingDiscountProducts: false,
    isLoadingPopularProducts: false,
    isLoadingBestRatingProducts: false,
    isLoadingCategoryProducts: false,
    isLoadingProduct: false,
    isCreatingProduct: false,
    isCheckingProducts: false,
    // ошибки
    importExcelError: "",
    productsError: "",
    categoryProductsError: "",
    discountProductsError: "",
    popularProductsError: "",
    bestRatingProductsError: "",
    productError: "",
    createProductError: "",
    checkProductsError: ""
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        toTrue: (state: ProductState) => {
            state.isLoadingProducts = true;
        },
        toFalse: (state: ProductState) => {
            state.isLoadingProducts = false;
        },
    },
    extraReducers: (builder: ActionReducerMapBuilder<ProductState>) => {
        handler.importProductsExcelHandler(builder);
        handler.getPopularProductsHandler(builder);
        handler.getBestRatingProductsHandler(builder);
        handler.getProductsWithDiscountHandler(builder);
        handler.getProductsByCategoriesHandler(builder);
        handler.getProductHandler(builder);
    },
});

export const {toFalse, toTrue} = productSlice.actions;
export default productSlice.reducer;
