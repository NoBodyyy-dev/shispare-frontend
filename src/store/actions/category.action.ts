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

export const createCategoryFunc = createAsyncThunk(
    "createCategory", async (payload: {title: string, image: string}, thunkAPI) => {
        try {
            console.log(payload);
            const response = await api.post("/category/create", payload, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            })
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
)