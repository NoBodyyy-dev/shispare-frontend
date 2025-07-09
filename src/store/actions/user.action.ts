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
    }, {rejectWithValue}): Promise<{ message: string, success: boolean } | undefined> => {
        try {
            const response = await api.post("/auth/login", payload)
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

export const getMeFunc = createAsyncThunk(
    "user/getMe", async (_, thunkAPI) => {
        try {
            const response = await api.get("/auth/refresh", {withCredentials: true})
            if (response.status === 200) {
                const getUser = await api.get("/user/me", {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                });
                return {user: getUser.data.user, tokens: response.data}
            } else return thunkAPI.rejectWithValue(response.data)
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const logoutFunc = createAsyncThunk(
    "user/logout", async (_, thunkAPI) => {
        try {
            const response = await api.post("/auth/logout")
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data)
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)