import {createOrderFunc, getUserOrdersFunc} from "../actions/order.action.ts";
import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {OrderState} from "../interfaces/order.interface.ts";
import {clearCartLocal} from "../slices/cart.slice.ts";

export const getUserOrdersHandler = (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
        .addCase(getUserOrdersFunc.pending, (state: OrderState) => {
            state.isLoadingOrders = true;
        }).addCase(getUserOrdersFunc.rejected, (state: OrderState, action) => {
        state.isLoadingOrders = false;
        state.successOrders = false
        state.errorOrders = action.error.message as string;
    }).addCase(getUserOrdersFunc.fulfilled, (state, action) => {
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
            
            // Очищаем корзину после успешного создания заказа
            const dispatch = (window as any).__store__?.dispatch;
            if (dispatch) {
                dispatch(clearCartLocal());
            }
            
            if (action.payload.order.paymentUrl) {
                window.location.href = action.payload.order.paymentUrl;
            }
        })
        .addCase(createOrderFunc.rejected, (state: OrderState, action) => {
            state.isLoadingCreateOrder = false;
            state.errorCreateOrder = action.error.message || "Ошибка создания заказа";
        })
}