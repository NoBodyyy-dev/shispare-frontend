import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { ProductState } from "../interfaces/product.interface.ts";
import * as handler from "../handlers/product.handler.ts";

const initialState: ProductState = {
  products: [],
  discountProducts: [],
  popularProducts: [],
  categoryProducts: [],
  product: {},
  curCategory: "",
  isLoadingProducts: false,
  isLoadingDiscountProducts: false,
  isLoadingPopularProducts: false,
  isLoadingCategoryProducts: false,
  isLoadingProduct: false,
  productsError: "",
  categoryProductsError: "",
  discountProductsError: "",
  popularProductsError: "",
  productError: ""
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
    // getProductsByCategoryHandler(builder);
    handler.getPopularProductsHandler(builder);
    handler.getProductsWithDiscountHandler(builder);
    handler.getProductsByCategoriesHandler(builder);
    handler.getProductHandler(builder);
  },
});

export const { toFalse, toTrue } = productSlice.actions;
export default productSlice.reducer;
