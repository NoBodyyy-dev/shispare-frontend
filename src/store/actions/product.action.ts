import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api.ts";

export const createProductFunc = createAsyncThunk(
  "createProduct",
  async (payload, thunkAPI) => {
    try {
      const response = await api.post(`/product/create-product`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status !== 200)
        return thunkAPI.rejectWithValue(response.data);
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getProductsByCategoryFunc = createAsyncThunk(
  "getProductsByCategory",
  async (slug: string, thunkAPI) => {
    try {
      const response = await api.get(
        `/product/get-products-by-category/${slug}`
      );
      if (response.status !== 200)
        return thunkAPI.rejectWithValue(response.data);
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getPopularProductsFunc = createAsyncThunk(
  "getPopularProducts",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/product/get-popular-products");
      if (response.status !== 200)
        return thunkAPI.rejectWithValue(response.data);
      return response.data;
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const getProductsWithDiscountFunc = createAsyncThunk(
  "getProductsWithDiscount",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/product/get-products-with-discount");
      if (response.status !== 200)
        return thunkAPI.rejectWithValue(response.data);
      return response.data;
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const getProductFunc = createAsyncThunk(
  "getProduct",
  async (slug: string, thunkAPI) => {
    try {
      const response = await api.get(`/product/get-product/${slug}`);
      if (response.status !== 200)
        return thunkAPI.rejectWithValue(response.data);
      return response.data;
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const setDiscountFunc = createAsyncThunk(
  "setDiscount",
  async (payload, thunkAPI) => {
    try {
      const response = await api.put(
        `/product/update-product/${payload.productID}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status !== 200)
        return thunkAPI.rejectWithValue(response.data);
      return response.data;
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const updateProductFunc = createAsyncThunk(
  "updateProduct",
  async (payload, thunkAPI) => {
    try {
      const response = await api.put(
        `/product/update-product/${payload.productID}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status !== 200)
        return thunkAPI.rejectWithValue(response.data);
      return response.data;
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);
