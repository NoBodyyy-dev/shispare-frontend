import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {BlogState} from "../interfaces/blog.interface.ts";
import {getAllPostsHandler, getCurrentPostHandler, createPostHandler, updatePostHandler, deletePostHandler} from "../handlers/blog.handler.ts";

const initialState: BlogState = {
    posts: [],
    currentPost: null,
    isLoadingPosts: false,
    isLoadingCurrentPost: false,
    isLoadingEventPosts: false,
    errorCurrentPost: "",
    errorPosts: "",
    errorEventPost: "",
};

const blogSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers(builder: ActionReducerMapBuilder<BlogState>) {
        getAllPostsHandler(builder);
        getCurrentPostHandler(builder);
        createPostHandler(builder);
        updatePostHandler(builder);
        deletePostHandler(builder);
    }
});

export default blogSlice.reducer;