import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api.ts";

export const getProductCommentsFunc = createAsyncThunk(
    "comment/getProductComments",
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/comment/get-product-comments/${productId}`);
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
            const response = await api.get("/comment/get-comments/me", {
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
            const response = await api.get(`/comment/get-comments/${userId}`, {
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
            if (response.status !== 201) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const deleteCommentFunc = createAsyncThunk(
    "comment/deleteComment",
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/comment/delete`, {
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