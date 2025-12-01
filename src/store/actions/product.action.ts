import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api.ts";

//
// 🔹 Создание товара
//
export const createProductFunc = createAsyncThunk(
    "product/create",
    async (payload: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/product/create`, payload, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status !== 200 && response.status !== 201)
                return rejectWithValue(response.data);
            return response.data;
        } catch (e: any) {
            const errorData = e.response?.data || e.response || {};
            const errorPayload: any = {
                message: errorData.message || e.message || "Ошибка при создании товара",
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

export const importProductsExcelFunc = createAsyncThunk(
    "product/importExcel",
    async (formData: FormData, thunkAPI) => {
        try {
            const response = await api.post(`/product/import`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status !== 200 && response.status !== 201)
                return thunkAPI.rejectWithValue(response.data);

            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getProductsByCategoryFunc = createAsyncThunk(
    "product/getByCategory",
    async (
        payload: {slug: string; params?: Record<string, any>},
        thunkAPI
    ) => {
        try {
            if (!payload.slug || payload.slug === "undefined") {
                return thunkAPI.rejectWithValue({message: "Category slug is required"});
            }
            const response = await api.get(`/product/category/${payload.slug}`, {
                params: payload.params,
            });
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getPopularProductsFunc = createAsyncThunk(
    "product/getPopular",
    async (limit?: number, thunkAPI) => {
        try {
            const url = limit ? `/product/popular?limit=${limit}` : `/product/popular`;
            const response = await api.get(url);
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getProductsWithDiscountFunc = createAsyncThunk(
    "product/getWithDiscount",
    async (_, thunkAPI) => {
        try {
            const response = await api.get(`/product/discounts`);
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Получить лучшие по рейтингу
//
export const getProductsByBestRatingFunc = createAsyncThunk(
    "product/getBestRating",
    async (limit?: number, thunkAPI) => {
        try {
            const url = limit ? `/product/best-rating?limit=${limit}` : `/product/best-rating`;
            const response = await api.get(url);
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Получить товар по slug
//
export const getProductFunc = createAsyncThunk(
    "product/getOne",
    async (article: number, thunkAPI) => {
        try {
            const response = await api.get(`/product/get-one/${article}`);
            if (response.status !== 200) return thunkAPI.rejectWithValue(response.data);
            console.log(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Обновить товар
//
export const updateProductFunc = createAsyncThunk(
    "product/update",
    async (payload: { productID: string; [key: string]: any }, thunkAPI) => {
        try {
            const response = await api.put(
                `/admin/product/update/${payload.productID}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Установить скидку на категорию
//
export const setCategoryDiscountFunc = createAsyncThunk(
    "product/setCategoryDiscount",
    async (
        payload: { categorySlug: string; discount: number },
        thunkAPI
    ) => {
        try {
            const response = await api.put(
                `/admin/product/category/${payload.categorySlug}/discount`,
                { discount: payload.discount },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Удалить товар
//
export const deleteProductFunc = createAsyncThunk(
    "product/delete",
    async (productID: string, thunkAPI) => {
        try {
            const response = await api.delete(`/admin/product/delete/${productID}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return { productID };
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Проверить список товаров по id
//
export const checkProductsFunc = createAsyncThunk(
    "product/check",
    async (payload: { ids: string[] }, thunkAPI) => {
        try {
            const response = await api.get("/product/check", {
                params: { ids: payload.ids.join(",") },
            });
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);