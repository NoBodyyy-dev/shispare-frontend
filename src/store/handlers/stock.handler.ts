import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {StockState} from "../interfaces/stock.interface.ts";
import * as action from "../actions/stock.action.ts"

export const getAllStocksHandler = (builder: ActionReducerMapBuilder<StockState>) => {
    builder
        .addCase(action.getAllStocks.pending, (state: StockState) => {
            state.isLoadingStocks = true;
        })
        .addCase(action.getAllStocks.rejected, (state: StockState, action) => {
            // state.isLoadingStocks = false;
            state.errorStocks = action.error.message!;
        })
        .addCase(action.getAllStocks.fulfilled, (state: StockState, action) => {
            // state.isLoadingStocks = false;
            state.stocks = [...action.payload.stocks];
        })
}