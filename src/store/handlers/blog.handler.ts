import {BlogState} from "../interfaces/blog.interface.ts";
import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {getAllPostsFunc} from "../actions/blog.action.ts";

export const getAllPostsHandler = (builder: ActionReducerMapBuilder<BlogState>) => {
    builder
        .addCase(getAllPostsFunc.pending, (state: BlogState) => {
            state.isLoadingPosts = true;
        })
        .addCase(getAllPostsFunc.rejected, (state: BlogState, action) => {
            state.isLoadingPosts = false;
            state.errorPosts = action.error.message!;
        })
        .addCase(getAllPostsFunc.fulfilled, (state: BlogState, action) => {
            state.isLoadingPosts = false;
            state.posts = [...action.payload.posts];
        })
}