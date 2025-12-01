import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api";

export const createRequestFunc = createAsyncThunk(
    "request/create",
    async (payload: {fullName: string; email: string; question: string}, {rejectWithValue}) => {
        try {
            const response = await api.post("/request/create", payload);
            if (response.status !== 201) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data || {message: "Ошибка при отправке заявки"});
        }
    }
);

export const getAllRequestsFunc = createAsyncThunk(
    "/request/getAll",
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.get("/admin/request/all", {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data || {message: "Ошибка при загрузке заявок"});
        }
    }
);

export const getRequestByIdFunc = createAsyncThunk(
    "request/getById",
    async (id: string, {rejectWithValue}) => {
        try {
            const response = await api.get(`/admin/request/${id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data || {message: "Ошибка при загрузке заявки"});
        }
    }
);

export const answerRequestFunc = createAsyncThunk(
    "request/answer",
    async (payload: {id: string; answer: string}, {rejectWithValue}) => {
        try {
            const response = await api.post(`/admin/request/${payload.id}/answer`, {answer: payload.answer}, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data || {message: "Ошибка при отправке ответа"});
        }
    }
);