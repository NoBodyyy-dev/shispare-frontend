import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// получить корзину
export const getCart = createAsyncThunk(
    "cart/get",
    async (_, thunkAPI) => {
        try {
            const { data } = await api.get("/cart/get", {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            return data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

// добавить товар
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (payload: { productId: string; quantity?: number }, thunkAPI) => {
        try {
            const { data } = await api.post("/cart/add-to-cart", payload, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            return data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

// обновить количество
export const updateQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async (payload: { productId: string; quantity: number }, thunkAPI) => {
        try {
            const { data } = await api.put(`/cart/update-quantity`, { quantity: payload.quantity, productId: payload.productId }, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            return data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

// удалить товар
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (payload: { productId: string }, thunkAPI) => {
        try {
            const { data } = await api.delete(`/cart/remove-from-cart?productId=${payload.productId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            return data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

// очистить корзину
export const clearCart = createAsyncThunk(
    "cart/clear",
    async (_, thunkAPI) => {
        try {
            const { data } = await api.delete("/cart/clear", {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            return data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);