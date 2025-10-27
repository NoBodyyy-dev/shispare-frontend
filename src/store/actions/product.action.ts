import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api.ts";

//
// 🔹 Создание товара
//
export const createProductFunc = createAsyncThunk(
    "product/create",
    async (payload, thunkAPI) => {
        try {
            const response = await api.post(`/product/create`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.status !== 200 && response.status !== 201)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Импорт Excel
//
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

//
// 🔹 Получить товары по категории
//
export const getProductsByCategoryFunc = createAsyncThunk(
    "product/getByCategory",
    async (slug: string, thunkAPI) => {
        try {
            console.log("slug >>>" ,slug)
            const response = await api.get(`/product/category/${slug}`);
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Получить популярные товары
//
export const getPopularProductsFunc = createAsyncThunk(
    "product/getPopular",
    async (_, thunkAPI) => {
        try {
            const response = await api.get(`/product/popular`);
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

//
// 🔹 Получить товары со скидкой
//
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
    async (_, thunkAPI) => {
        try {
            const response = await api.get(`/product/best-rating`);
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
    async (slug: string, thunkAPI) => {
        try {
            const response = await api.get(`/product/slug/${slug}`);
            if (response.status !== 200)
                return thunkAPI.rejectWithValue(response.data);
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
                `/product/update/${payload.productID}`,
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
                `/product/category/${payload.categorySlug}/discount`,
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
            const response = await api.delete(`/product/delete/${productID}`, {
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