import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import {StockState} from "../interfaces/stock.interface.ts";
import * as handler from "../handlers/stock.handler.ts";

const initialState: StockState = {
    stocks: [],
    curStock: {},
    isLoadingStocks: false,
    isLoadingCurStock: false,
    errorStocks: null,
    errCurStock: null,
};

const productSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<StockState>) => {
        handler.getAllStocksHandler(builder);
        handler.getStockBySlugHandler(builder);
    },
});

export default productSlice.reducer;
