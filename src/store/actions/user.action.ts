import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api";
import {RegisterData} from "../interfaces/user.interface";

export const registerFunc = createAsyncThunk(
    "/user/register", async (payload: RegisterData, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/register", payload)
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            // Извлекаем ошибки из ответа сервера
            const errorData = e.response?.data || e.response || {};
            
            // Формируем структурированный объект ошибок
            const errorPayload: any = {
                message: errorData.message || e.message || "Ошибка регистрации",
                errors: {}
            };
            
            // Обрабатываем ошибки express-validator в формате [{ msg: string, param: string }]
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
            }
            // Если ошибки в формате { errors: { field: ["error"] } }
            else if (errorData.errors && typeof errorData.errors === 'object') {
                errorPayload.errors = errorData.errors;
            }
            
            return rejectWithValue(errorPayload);
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
        } catch (e: any) {
            // Извлекаем ошибки из ответа сервера
            const errorData = e.response?.data || e.response || {};
            
            // Формируем структурированный объект ошибок
            const errorPayload: any = {
                message: errorData.message || e.message || "Ошибка авторизации",
                errors: {}
            };
            
            // Обрабатываем ошибки express-validator в формате [{ msg: string, param: string }]
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
            }
            // Если ошибки в формате { errors: { field: ["error"] } }
            else if (errorData.errors && typeof errorData.errors === 'object') {
                errorPayload.errors = errorData.errors;
            }
            
            return rejectWithValue(errorPayload);
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
        } catch (e: any) {
            const errorData = e.response?.data || e.response || {};
            const errorPayload: any = {
                message: errorData.message || e.message || "Ошибка подтверждения кода",
                errors: {}
            };
            
            if (Array.isArray(errorData.errors)) {
                errorData.errors.forEach((err: any) => {
                    const field = err.param || err.field || 'code';
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
            const response = await api.get("/admin/user/get-user/all", {
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

export const getAllStaffFunc = createAsyncThunk(
    "/user/getAllStaff", async (_, {rejectWithValue}) => {
        try {
            const response = await api.get("/admin/user/get-staff/all", {
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
            const response = await api.get(`/admin/user/get-user/${payload.id}`, {
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

export const banUserFunc = createAsyncThunk(
    "/user/banUser", async (payload: {userId: string; banned: boolean}, {rejectWithValue}) => {
        try {
            const response = await api.put(`/admin/user/ban/${payload.userId}`, {banned: payload.banned}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status !== 200) return rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
)