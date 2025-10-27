import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api.ts";
import {DeliveryType, PaymentMethod} from "../interfaces/order.interface.ts";

export const getUserOrdersFunc = createAsyncThunk(
    "order/getAllOrdersFunc", async ({userId}: {userId: string}, {rejectWithValue}) => {
        try {
            const response = await api.get(`/order/get-user-orders/${userId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            })
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            rejectWithValue(e);
        }
    }
)

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
                "/order/create",
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
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)