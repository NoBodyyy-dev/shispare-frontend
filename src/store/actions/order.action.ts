import {createAsyncThunk} from "@reduxjs/toolkit";
import {DeliveryType, PaymentMethod} from "../interfaces/order.interface.ts";
import api from "../api.ts";

export const getOneOrderFunc = createAsyncThunk(
    "order/getOneOrder", async ({orderNumber}: {orderNumber: number | string}, {rejectWithValue}) => {
        try {
            const response = await api.get(`/user/order/${orderNumber}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data || {message: "Ошибка при загрузке заказа"});
        }
    }
);

export const getUserOrdersFunc = createAsyncThunk(
    "order/getAllOrdersFunc", async ({userId}: {userId: string}, {rejectWithValue}) => {
        try {
            const response = await api.get(`/user/order/get-user-orders/${userId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data || {message: "Ошибка при загрузке заказов"});
        }
    }
);

export const getOrderByNumberFunc = createAsyncThunk(
    "order/getOrderByNumber", async (orderNumber: string, {rejectWithValue}) => {
        try {
            const response = await api.get(`/user/order/get-order/${orderNumber}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data || {message: "Ошибка при загрузке заказа"});
        }
    }
);

export const createOrderFunc = createAsyncThunk(
    "order/createOrder", async (payload: {
        deliveryKind: DeliveryType;
        phone: string;
        paymentMethod: PaymentMethod;
        fullName?: string;
        address?: string;
        comment?: string;
    }, thunkAPI) => {
        try {
            const response = await api.post(
                "/user/order/create",
                {
                    deliveryInfo: {
                        city: payload.address,
                        address: payload.address,
                        recipientName: payload.fullName,
                        phone: payload.phone,
                        comment: payload.comment,
                    },
                    deliveryType: payload.deliveryKind,
                    paymentMethod: payload.paymentMethod,
                },
                {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
            );
            if (response.status !== 201) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response?.data || {message: "Ошибка при создании заказа"});
        }
    }
);