import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {createOrderHandler, getAllOrdersHandler} from "../handlers/order.handler.ts";
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
    reducers: {
        addOrder: (state, action) => {
            state.orders = [...state.orders, action.payload.order];
        },
    },
    extraReducers: (builder: ActionReducerMapBuilder<OrderState>) => {
        getAllOrdersHandler(builder);
        createOrderHandler(builder);
    }
});

export const {
    addOrder,
} = socketSlice.actions;
export default socketSlice.reducer;