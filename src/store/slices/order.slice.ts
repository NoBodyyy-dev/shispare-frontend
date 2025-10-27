import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {createOrderHandler, getUserOrdersHandler} from "../handlers/order.handler.ts";
import {OrderState} from "../interfaces/order.interface.ts";

const initialState: OrderState = {
    orders: [],
    isLoadingCreateOrder: false,
    isLoadingOrders: false,
    successOrders: false,
    errorOrders: "",
    errorCreateOrder: ""
};

const socketSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<OrderState>) => {
        getUserOrdersHandler(builder);
        createOrderHandler(builder);
    }
});

export default socketSlice.reducer;