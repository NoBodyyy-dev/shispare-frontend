import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { CategoryState } from "../interfaces/category.interface";
import * as action from "../actions/category.action";

export const getAllCategoriesHandler = (
  builder: ActionReducerMapBuilder<CategoryState>
) => {
  builder
    .addCase(action.getAllCategoriesFunc.pending, (state: CategoryState) => {
      state.isLoadingCategory = true;
    })
    .addCase(
      action.getAllCategoriesFunc.rejected,
      (state: CategoryState, action) => {
        state.isLoadingCategory = false;
        console.log(action.error);
      }
    )
    .addCase(
      action.getAllCategoriesFunc.fulfilled,
      (state: CategoryState, action) => {
        state.isLoadingCategory = false;
        console.log(action);
        
        state.categories = action.payload.categories;
      }
    );
};
