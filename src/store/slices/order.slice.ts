import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {createOrderHandler, getOneOrderHandler, getOrderByNumberHandler, getUserOrdersHandler} from "../handlers/order.handler.ts";
import {OrderState} from "../interfaces/order.interface.ts";

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    isLoadingOrders: false,
    isLoadingOrder: false,
    isLoadingCreateOrder: false,
    successOrders: false,
    errorOrders: "",
    errorOrder: "",
    errorCreateOrder: ""
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearCurrentOrder: (state: OrderState) => {
            state.currentOrder = null;
            state.errorOrder = "";
        },
        clearOrders: (state: OrderState) => {
            state.orders = [];
            state.errorOrders = "";
        }
    },
    extraReducers: (builder: ActionReducerMapBuilder<OrderState>) => {
        getUserOrdersHandler(builder);
        createOrderHandler(builder);
        getOrderByNumberHandler(builder);
        getOneOrderHandler(builder);
    }
});

export const {clearCurrentOrder, clearOrders} = orderSlice.actions;
export default orderSlice.reducer;