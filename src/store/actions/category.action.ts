import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getAllCategoriesFunc = createAsyncThunk(
    "getAllCategories", async (_: undefined, thunkAPI) => {
        try {
            const response = await api.get("/category/get-all")
            console.log(response);
            
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
)