import {createOrderFunc, getAllOrdersFunc} from "../actions/order.action.ts";
import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {OrderState} from "../interfaces/order.interface.ts";

export const getAllOrdersHandler = (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
        .addCase(getAllOrdersFunc.pending, (state: OrderState) => {
            state.isLoadingOrders = true;
        }).addCase(getAllOrdersFunc.rejected, (state: OrderState, action) => {
        state.isLoadingOrders = false;
        state.successOrders = false
        state.errorOrders = action.error.message as string;
    }).addCase(getAllOrdersFunc.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.isLoadingOrders = false;
        state.successOrders = true;
    })
}

export const createOrderHandler = (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
        .addCase(createOrderFunc.pending, (state: OrderState) => {
            state.isLoadingCreateOrder = true;
        })
        .addCase(createOrderFunc.fulfilled, (state: OrderState, action) => {
            console.log(">>>", action.payload)
            state.isLoadingCreateOrder = false;
            window.location.href = action.payload.order.paymentUrl
        })
}