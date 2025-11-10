import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {StockState} from "../interfaces/stock.interface.ts";
import * as action from "../actions/stock.action.ts"

export const getAllStocksHandler = (builder: ActionReducerMapBuilder<StockState>) => {
    builder
        .addCase(action.getAllStocks.pending, (state: StockState) => {
            state.isLoadingStocks = true;
        })
        .addCase(action.getAllStocks.rejected, (state: StockState, action) => {
            state.isLoadingStocks = false;
            state.errorStocks = action.error.message!;
        })
        .addCase(action.getAllStocks.fulfilled, (state: StockState, action) => {
            state.isLoadingStocks = false;
            state.stocks = [...action.payload.stocks];
        })
}

export const getStockBySlugHandler = (builder: ActionReducerMapBuilder<StockState>) => {
    builder
        .addCase(action.getStockBySlug.pending, (state: StockState) => {
            state.isLoadingCurStock = true;
        })
        .addCase(action.getStockBySlug.rejected, (state: StockState, action) => {
            state.isLoadingCurStock = false;
            state.errCurStock = action.error.message!;
        })
        .addCase(action.getStockBySlug.fulfilled, (state: StockState, action) => {
            state.isLoadingCurStock = false;
            state.curStock = action.payload.stock;
        })
}