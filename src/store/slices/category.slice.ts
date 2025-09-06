import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { CategoryState } from "../interfaces/category.interface";
import * as handler from "../handlers/category.handler";

const initialState: CategoryState = {
  categories: [],
  isLoadingCategory: false,
  isLoadingCreateCategory: false,
  errorCreateCategory: "",
};

const categorySlice = createSlice({
  name: "categorySlice",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<CategoryState>) => {
    handler.getAllCategoriesHandler(builder);
    handler.createCategoryHandler(builder);
  },
});

export default categorySlice.reducer;
