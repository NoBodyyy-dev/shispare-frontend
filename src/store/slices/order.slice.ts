import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {createOrderHandler, getOrderByNumberHandler, getUserOrdersHandler, getOneOrderHandler} from "../handlers/order.handler.ts";
import {OrderState} from "../interfaces/order.interface.ts";

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    isLoadingCreateOrder: false,
    isLoadingOrders: false,
    isLoadingOrder: false,
    successOrders: false,
    errorOrders: "",
    errorOrder: "",
    errorCreateOrder: ""
};

const socketSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<OrderState>) => {
        getUserOrdersHandler(builder);
        createOrderHandler(builder);
        getOrderByNumberHandler(builder);
        getOneOrderHandler(builder);
    }
});

export default socketSlice.reducer;