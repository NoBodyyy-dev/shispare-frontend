import { createAsyncThunk } from "@reduxjs/toolkit";
import { CartProductInterface } from "../interfaces/product.interface.ts";
import api from "../api";

export const getCart = createAsyncThunk("cart/get", async (_, thunkAPI) => {
    try {
        const { data, status } = await api.get("/user/cart/get", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (status !== 200) return thunkAPI.rejectWithValue(data);
        return data.data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e);
    }
});

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (
        payload: { productId: string; article: number; quantity?: number },
        thunkAPI
    ) => {
        try {
            const { data, status } = await api.post("/user/cart/add", payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (status !== 200) return thunkAPI.rejectWithValue(data);
            return data.data as { item: CartProductInterface };
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const updateQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async (
        payload: { productId: string; article: number; quantity: number },
        thunkAPI
    ) => {
        try {
            const { data, status } = await api.put("/user/cart/update", payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (status !== 200) return thunkAPI.rejectWithValue(data);
            return data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (payload: { productId: string; article: number }, thunkAPI) => {
        try {
            const { data } = await api.delete(
                `/user/cart/remove?productId=${payload.productId}&article=${payload.article}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            return data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const clearCart = createAsyncThunk("cart/clear", async (_, thunkAPI) => {
    try {
        const { data } = await api.delete("/user/cart/clear", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        return data.data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e);
    }
});

export const syncCart = createAsyncThunk(
    "cart/sync",
    async (items: Array<{ productId: string; article: number; quantity: number }>, thunkAPI) => {
        try {
            const { data, status } = await api.post("/user/cart/sync", { items }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (status !== 200) return thunkAPI.rejectWithValue(data);
            return data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);