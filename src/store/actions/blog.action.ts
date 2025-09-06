import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api.ts";

export const getAllPostsFunc = createAsyncThunk(
    "/blog/getPosts", async (_: undefined, thunkAPI) => {
        try {
            const response = await api.get("/blog/get-all");
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getCurrentPostFunc = createAsyncThunk(
    "/blog/getCurrentPost", async (slug: string, thunkAPI) => {
        try {
            const response = await api.get(`/blog/get-post/${slug}`);
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const createPostFunc = createAsyncThunk(
    "/blog/createPost",
    async (payload: { title: string; content: string; image: FileList }, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append("title", payload.title);
            formData.append("content", payload.content);
            if (payload.image && payload.image[0]) {
                formData.append("image", payload.image[0]);
            }

            const response = await api.post("/blog/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const updatePostFunc = createAsyncThunk(
    "/blog/updatePost",
    async (payload: { id: string, title?: string; content?: string; image?: FileList }, thunkAPI) => {
        try {
            const formData = new FormData();
            if (payload.title) formData.append("title", payload.title);
            if (payload.content) formData.append("content", payload.content);
            if (payload.image && payload.image[0]) formData.append("image", payload.image[0]);

            const response = await api.post(`/blog/update/${payload.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const deletePostFunc = createAsyncThunk(
    "/blog/deletePost",
    async (id: string, thunkAPI) => {
        try {
            const response = await api.delete(`/blog/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

