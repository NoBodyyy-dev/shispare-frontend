import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api.ts";

export const getAllStocks = createAsyncThunk(
    "getAllStocks", async (_, thunkAPI) => {
        try {
            const response = await api.get("/stock/get-all")
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const getStockBySlug = createAsyncThunk(
    "getStockBySlug", async (slug: string, thunkAPI) => {
        try {
            const response = await api.get(`/stock/get-stock/${slug}`)
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)