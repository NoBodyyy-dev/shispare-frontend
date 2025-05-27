import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api.ts";

export const getAllPostsFunc = createAsyncThunk(
    "blog/getPosts", async (_: undefined, thunkAPI) => {
        try {
            const response = await api.get("/blog/get-all");
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);