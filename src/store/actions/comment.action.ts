import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api.ts";

export const getProductCommentsFunc = createAsyncThunk(
    "comment/getProductComments",
    async (payload: { productId: string; page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const { productId, page = 1, limit = 5 } = payload;
            const response = await api.get(`/comment/get-product-comments/${productId}`, {
                params: { page, limit }
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const getCommentByIdFunc = createAsyncThunk(
    "comment/getCommentById",
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/comment/get-comment/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const getMyCommentsFunc = createAsyncThunk(
    "comment/getMyComments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/user/comment/get-comments/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const getUserCommentsFunc = createAsyncThunk(
    "comment/getUserComments",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/comment/get-comments/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const createCommentFunc = createAsyncThunk(
    "comment/createComment",
    async (payload: {
        product: string;
        text: string;
        rating: number;
    }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/comment/create",
                {
                    product: payload.product,
                    content: payload.text, // Backend expects 'content', not 'text'
                    rating: payload.rating
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            if (response.status !== 200 && response.status !== 201) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            const errorData = e.response?.data || e.response || {};
            const errorPayload: any = {
                message: errorData.message || e.message || "Ошибка при создании комментария",
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
);

export const deleteCommentFunc = createAsyncThunk(
    "comment/deleteComment",
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/admin/comment/delete`, {
                data: { id: commentId },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return { id: commentId, ...response.data };
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const checkCanCommentFunc = createAsyncThunk(
    "comment/checkCanComment",
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/comment/check-can-comment/${productId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || e.message || "Ошибка при проверке возможности комментирования";
            return rejectWithValue({ message: errorMessage, error: e.response?.data });
        }
    }
);