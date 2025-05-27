import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {BlogState} from "../interfaces/blog.interface.ts";
import {getAllPostsHandler} from "../handlers/blog.handler.ts";

const initialState: BlogState = {
    posts: [],
    currentPost: {},
    isLoadingPosts: false,
    isLoadingCurrentPost: false,
    errorCurrentPost: "",
    errorPosts: ""
};

const blogSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers(builder: ActionReducerMapBuilder<BlogState>) {
        getAllPostsHandler(builder);
    }
});

export default blogSlice.reducer;