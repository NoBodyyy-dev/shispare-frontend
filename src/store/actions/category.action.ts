import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getAllCategoriesFunc = createAsyncThunk(
    "getAllCategories", async (_: undefined, thunkAPI) => {
        try {
            const response = await api.get("/category/get-all")
            console.log("getAllCategoriesFunc response:", response);
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            console.error("getAllCategoriesFunc error:", e);
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const createCategoryFunc = createAsyncThunk(
    "createCategory", async (payload: {title: string, image: string}, { rejectWithValue }) => {
        try {
            console.log(payload);
            const response = await api.post("/admin/category/create", payload, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            })
            if (response.status !== 200 && response.status !== 201) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            const errorData = e.response?.data || e.response || {};
            const errorPayload: any = {
                message: errorData.message || e.message || "Ошибка при создании категории",
                errors: {}
            };
            
            if (Array.isArray(errorData.errors)) {
                errorData.errors.forEach((err: any) => {
                    const field = err.param || err.field || 'general';
                    const message = err.msg || err.message || err;
                    if (!errorPayload.errors[field]) {
                        errorPayload.errors[field] = [];
                    }
                    if (Array.isArray(errorPayload.errors[field])) {
                        errorPayload.errors[field].push(message);
                    } else {
                        errorPayload.errors[field] = [message];
                    }
                });
            } else if (errorData.errors && typeof errorData.errors === 'object') {
                errorPayload.errors = errorData.errors;
            }
            
            return rejectWithValue(errorPayload);
        }
    }
)