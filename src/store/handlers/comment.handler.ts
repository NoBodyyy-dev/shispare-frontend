import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { CommentState } from "../interfaces/comment.interface.ts";
import {
    getProductCommentsFunc,
    getCommentByIdFunc,
    getMyCommentsFunc,
    getUserCommentsFunc,
    createCommentFunc,
    deleteCommentFunc
} from "../actions/comment.action.ts";

export const getProductCommentsHandler = (builder: ActionReducerMapBuilder<CommentState>) => {
    builder
        .addCase(getProductCommentsFunc.pending, (state: CommentState) => {
            state.isLoadingComments = true;
            state.errorComments = "";
        })
        .addCase(getProductCommentsFunc.rejected, (state: CommentState, action) => {
            state.isLoadingComments = false;
            state.errorComments = action.error.message as string;
        })
        .addCase(getProductCommentsFunc.fulfilled, (state: CommentState, action) => {
            state.isLoadingComments = false;
            state.comments = action.payload.comments || action.payload;
            state.errorComments = "";
        });
};

export const getCommentByIdHandler = (builder: ActionReducerMapBuilder<CommentState>) => {
    builder
        .addCase(getCommentByIdFunc.pending, (state: CommentState) => {
            state.isLoadingActionComment = true;
            state.errorActionComment = "";
        })
        .addCase(getCommentByIdFunc.rejected, (state: CommentState, action) => {
            state.isLoadingActionComment = false;
            state.errorActionComment = action.error.message as string;
        })
        .addCase(getCommentByIdFunc.fulfilled, (state: CommentState, action) => {
            state.isLoadingActionComment = false;
            // Обновляем конкретный комментарий в списке или добавляем его
            const index = state.comments.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.comments[index] = action.payload;
            } else {
                state.comments.push(action.payload);
            }
            state.errorActionComment = "";
        });
};

export const getMyCommentsHandler = (builder: ActionReducerMapBuilder<CommentState>) => {
    builder
        .addCase(getMyCommentsFunc.pending, (state: CommentState) => {
            state.isLoadingComments = true;
            state.errorComments = "";
        })
        .addCase(getMyCommentsFunc.rejected, (state: CommentState, action) => {
            state.isLoadingComments = false;
            state.errorComments = action.error.message as string;
        })
        .addCase(getMyCommentsFunc.fulfilled, (state: CommentState, action) => {
            state.isLoadingComments = false;
            state.comments = action.payload.comments || action.payload;
            state.errorComments = "";
        });
};

export const getUserCommentsHandler = (builder: ActionReducerMapBuilder<CommentState>) => {
    builder
        .addCase(getUserCommentsFunc.pending, (state: CommentState) => {
            state.isLoadingComments = true;
            state.errorComments = "";
        })
        .addCase(getUserCommentsFunc.rejected, (state: CommentState, action) => {
            state.isLoadingComments = false;
            state.errorComments = action.error.message as string;
        })
        .addCase(getUserCommentsFunc.fulfilled, (state: CommentState, action) => {
            state.isLoadingComments = false;
            state.comments = action.payload.comments || action.payload;
            state.errorComments = "";
        });
};

export const createCommentHandler = (builder: ActionReducerMapBuilder<CommentState>) => {
    builder
        .addCase(createCommentFunc.pending, (state: CommentState) => {
            state.isLoadingActionComment = true;
            state.errorActionComment = "";
        })
        .addCase(createCommentFunc.rejected, (state: CommentState, action) => {
            state.isLoadingActionComment = false;
            state.errorActionComment = action.error.message as string;
        })
        .addCase(createCommentFunc.fulfilled, (state: CommentState, action) => {
            state.isLoadingActionComment = false;
            state.comments.push(action.payload.comment || action.payload);
            state.errorActionComment = "";
        });
};

export const deleteCommentHandler = (builder: ActionReducerMapBuilder<CommentState>) => {
    builder
        .addCase(deleteCommentFunc.pending, (state: CommentState) => {
            state.isLoadingActionComment = true;
            state.errorActionComment = "";
        })
        .addCase(deleteCommentFunc.rejected, (state: CommentState, action) => {
            state.isLoadingActionComment = false;
            state.errorActionComment = action.error.message as string;
        })
        .addCase(deleteCommentFunc.fulfilled, (state: CommentState, action) => {
            state.isLoadingActionComment = false;
            state.comments = state.comments.filter(c => c._id !== action.payload.id);
            state.errorActionComment = "";
        });
};