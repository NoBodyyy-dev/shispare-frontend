import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api";

export const registerFunc = createAsyncThunk(
    "/user/register", async (payload: { fullName: string }, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/register", payload)
            return response.data;
        } catch (e) {
            rejectWithValue(e);
        }
    }
)

export const authenticateFunc = createAsyncThunk(
    "/user/authenticate", async (payload: {
        email: string,
        password: string
    }, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/authenticate", payload)
            return response.data;
        } catch (e) {
            rejectWithValue(e);
        }
    }
)

export const verifyCodeFunc = createAsyncThunk(
    "/user/verifyCode", async (payload: {
        code: string;
    }, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/verify", payload)
            return response.data;
        } catch (e) {
            rejectWithValue(e);
        }
    }
)

export const refreshTokenFunc = createAsyncThunk(
    "/user/refreshToken", async (payload: {
        code: string;
    }, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/refresh", payload)
            return response.data;
        } catch (e) {
            rejectWithValue(e);
        }
    }
)
