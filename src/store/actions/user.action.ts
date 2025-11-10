import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api";

export const registerFunc = createAsyncThunk(
    "/user/register", async (payload: { fullName: string }, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/register", payload)
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return  rejectWithValue(e);
        }
    }
)

export const authenticateFunc = createAsyncThunk(
    "/user/authenticate", async (payload: {
        email: string,
        password: string
    }, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/login", payload)
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
)

export const verifyCodeFunc = createAsyncThunk(
    "/user/verifyCode", async (payload: {
        code: string;
    }, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/verify", payload)
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
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

export const getAllUsersFunc = createAsyncThunk(
    "/user/getAllUsers", async (_, {rejectWithValue}) => {
        try {
            const response = await api.get("/user/get-user/all", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            rejectWithValue(e);
        }
    }
)

export const getProfileUserFunc = createAsyncThunk(
    "/user/getProfileUser", async (payload: {id: string}, {rejectWithValue}) => {
        try {
            const response = await api.get(`/user/get-user/${payload.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            rejectWithValue(e);
        }
    }
)

export const checkVerifyFunc = createAsyncThunk(
    "/user/checkVerify", async (_, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/check-verify")
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
)