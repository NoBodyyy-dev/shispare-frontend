import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api.ts";
import {IBody} from "../interfaces/solution.interface.ts";

export const getAllSolutionsFunc = createAsyncThunk(
    "solution/getAllSolutions", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/solution/all");
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || e.message || "Ошибка при получении решений";
            return rejectWithValue({ message: errorMessage, error: e.response?.data });
        }
    }
);

export const getOneSolutionFunc = createAsyncThunk(
    "solution/getOneSolution", 
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/solution/get-one/${slug}`);
            if (response.status !== 200) return rejectWithValue(response.data);
            console.log("yzeba;", response.data);
            return response.data;
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || e.message || "Ошибка при получении решения";
            return rejectWithValue({ message: errorMessage, error: e.response?.data });
        }
    }
);

export const createSolutionFunc = createAsyncThunk(
    "solution/createSolution", 
    async (data: IBody, { rejectWithValue }) => {
        try {
            const response = await api.post("/admin/solution/create", data, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200 && response.status !== 201) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || e.message || "Ошибка при создании решения";
            return rejectWithValue({ message: errorMessage, error: e.response?.data });
        }
    }
);

export const updateSolutionFunc = createAsyncThunk(
    "solution/updateSolution", 
    async ({ slug, data }: { slug: string; data: IBody }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/solution/update/${slug}`, data, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || e.message || "Ошибка при обновлении решения";
            return rejectWithValue({ message: errorMessage, error: e.response?.data });
        }
    }
);

export const deleteSolutionFunc = createAsyncThunk(
    "solution/deleteSolution", 
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/admin/solution/delete/${slug}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return { slug, ...response.data };
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || e.message || "Ошибка при удалении решения";
            return rejectWithValue({ message: errorMessage, error: e.response?.data });
        }
    }
);