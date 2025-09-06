import {BlogState} from "../interfaces/blog.interface.ts";
import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {
    createPostFunc,
    deletePostFunc,
    getAllPostsFunc,
    getCurrentPostFunc,
    updatePostFunc
} from "../actions/blog.action.ts";

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

export const getCurrentPostHandler = (builder: ActionReducerMapBuilder<BlogState>) => {
    builder
        .addCase(getCurrentPostFunc.pending, (state: BlogState) => {
            state.isLoadingCurrentPost = true;
        })
        .addCase(getCurrentPostFunc.rejected, (state: BlogState, action) => {
            state.isLoadingCurrentPost = false;
            state.errorCurrentPost = action.error.message!;
        })
        .addCase(getCurrentPostFunc.fulfilled, (state: BlogState, action) => {
            state.isLoadingCurrentPost = false;
            state.errorCurrentPost = "";
            state.currentPost = action.payload.posts;
        })
}

export const createPostHandler = (builder: ActionReducerMapBuilder<BlogState>) => {
    builder
        .addCase(createPostFunc.pending, (state: BlogState) => {
            state.isLoadingEventPosts = true;
        })
        .addCase(createPostFunc.rejected, (state: BlogState, action) => {
            state.isLoadingEventPosts = false;
            state.errorEventPost = action.error.message!
        })
        .addCase(createPostFunc.fulfilled, (state: BlogState, action) => {
            state.isLoadingEventPosts = false;
            state.errorEventPost = "";
            state.posts = [...state.posts, action.payload.post];
        })
}

export const updatePostHandler = (builder: ActionReducerMapBuilder<BlogState>) => {
    builder
        .addCase(updatePostFunc.pending, (state: BlogState) => {
            state.isLoadingEventPosts = true;
        })
        .addCase(updatePostFunc.rejected, (state: BlogState, action) => {
            state.isLoadingEventPosts = false;
            state.errorEventPost = action.error.message!
        })
        .addCase(updatePostFunc.fulfilled, (state: BlogState, action) => {
            state.isLoadingEventPosts = false;
            state.errorEventPost = "";
            const newPost: number = state.posts.findIndex((post) => post._id === action.payload.post._id);
            state.posts[newPost] = action.payload.post

        })
}

export const deletePostHandler = (builder: ActionReducerMapBuilder<BlogState>) => {
    builder
        .addCase(deletePostFunc.pending, (state: BlogState) => {
            state.isLoadingEventPosts = true;
        })
        .addCase(deletePostFunc.rejected, (state: BlogState, action) => {
            state.isLoadingEventPosts = false;
            state.errorEventPost = action.error.message!
        })
        .addCase(deletePostFunc.fulfilled, (state: BlogState, action) => {
            state.isLoadingEventPosts = false;
            state.errorEventPost = "";
            state.posts = state.posts.filter((post) => post._id === action.payload.post._id);
        })
}