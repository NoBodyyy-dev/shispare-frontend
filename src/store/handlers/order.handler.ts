import {createOrderFunc, getOneOrderFunc, getOrderByNumberFunc, getUserOrdersFunc} from "../actions/order.action.ts";
import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {OrderState} from "../interfaces/order.interface.ts";
import {clearCartLocal} from "../slices/cart.slice.ts";
import {getCart} from "../actions/cart.action.ts";

export const getUserOrdersHandler = (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
        .addCase(getUserOrdersFunc.pending, (state: OrderState) => {
            state.isLoadingOrders = true;
            state.errorOrders = "";
        })
        .addCase(getUserOrdersFunc.rejected, (state: OrderState, action) => {
            state.isLoadingOrders = false;
            state.successOrders = false;
            state.errorOrders = action.error.message || "Ошибка при загрузке заказов";
        })
        .addCase(getUserOrdersFunc.fulfilled, (state, action) => {
            state.orders = action.payload.orders || [];
            state.isLoadingOrders = false;
            state.successOrders = true;
            state.errorOrders = "";
        });
};

export const createOrderHandler = (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
        .addCase(createOrderFunc.pending, (state: OrderState) => {
            state.isLoadingCreateOrder = true;
        })
        .addCase(createOrderFunc.fulfilled, (state: OrderState, action) => {
            console.log(">>>", action.payload)
            state.isLoadingCreateOrder = false;
            
            setTimeout(() => {
                const dispatch = (window as any).__store__?.dispatch;
                const getState = (window as any).__store__?.getState;
                if (dispatch && getState) {
                    // Получаем статус авторизации из store (теперь это безопасно, т.к. reducer уже завершился)
                    const isAuthenticated = getState()?.user?.isAuthenticated || false;
                    dispatch(clearCartLocal({ isAuthenticated }));
                    // Перезагружаем корзину с сервера, чтобы убедиться, что она очищена (только для авторизованных)
                    if (isAuthenticated) {
                        setTimeout(() => {
                            dispatch(getCart());
                        }, 500);
                    }
                }
                
                // Редирект на страницу оплаты, если есть paymentUrl
                if (action.payload.paymentUrl) {
                    window.location.href = action.payload.paymentUrl;
                }
            }, 0);
        })
        .addCase(createOrderFunc.rejected, (state: OrderState, action) => {
            state.isLoadingCreateOrder = false;
            state.errorCreateOrder = action.error.message || "Ошибка создания заказа";
        });
};

export const getOrderByNumberHandler = (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
        .addCase(getOrderByNumberFunc.pending, (state: OrderState) => {
            state.isLoadingOrder = true;
            state.errorOrder = "";
        })
        .addCase(getOrderByNumberFunc.fulfilled, (state: OrderState, action) => {
            state.currentOrder = action.payload.order || action.payload;
            state.isLoadingOrder = false;
            state.errorOrder = "";
        })
        .addCase(getOrderByNumberFunc.rejected, (state: OrderState, action) => {
            state.isLoadingOrder = false;
            state.errorOrder = action.error.message || "Ошибка загрузки заказа";
            state.currentOrder = null;
        });
};

export const getOneOrderHandler = (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
        .addCase(getOneOrderFunc.pending, (state: OrderState) => {
            state.isLoadingOrder = true;
            state.errorOrder = "";
        })
        .addCase(getOneOrderFunc.fulfilled, (state: OrderState, action) => {
            state.currentOrder = action.payload.order || action.payload;
            state.isLoadingOrder = false;
            state.errorOrder = "";
        })
        .addCase(getOneOrderFunc.rejected, (state: OrderState, action) => {
            state.isLoadingOrder = false;
            state.errorOrder = action.error.message || "Ошибка загрузки заказа";
            state.currentOrder = null;
        });
};