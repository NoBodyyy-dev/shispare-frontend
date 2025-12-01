import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { CommentState } from "../interfaces/comment.interface.ts";
import {
    getProductCommentsFunc,
    getCommentByIdFunc,
    getMyCommentsFunc,
    getUserCommentsFunc,
    createCommentFunc,
    deleteCommentFunc,
    checkCanCommentFunc
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
            if (action.payload.comments && action.payload.pagination) {
                state.comments = Array.isArray(action.payload.comments) ? action.payload.comments : [];
                state.pagination = action.payload.pagination;
            } else {
                // Обратная совместимость
                const comments = action.payload.comments || action.payload;
                state.comments = Array.isArray(comments) ? comments : [];
                state.pagination = null;
            }
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
            // Убедимся, что comments - массив
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            }
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
            const comments = action.payload.comments || action.payload;
            state.comments = Array.isArray(comments) ? comments : [];
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
            const comments = action.payload.comments || action.payload;
            state.comments = Array.isArray(comments) ? comments : [];
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
            const errorMessage = (action.payload as any)?.message || action.error?.message || "Ошибка при создании комментария";
            state.errorActionComment = errorMessage;
        })
        .addCase(createCommentFunc.fulfilled, (state: CommentState, action) => {
            state.isLoadingActionComment = false;
            // Убедимся, что comments - массив
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            }
            const newComment = action.payload.comment || action.payload;
            if (newComment) {
                state.comments.push(newComment);
            }
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
            // Убедимся, что comments - массив
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            } else {
                state.comments = state.comments.filter(c => c._id !== action.payload.id);
            }
            state.errorActionComment = "";
        });
};

export const checkCanCommentHandler = (builder: ActionReducerMapBuilder<CommentState>) => {
    builder
        .addCase(checkCanCommentFunc.pending, (state: CommentState) => {
            state.isLoadingCanComment = true;
            state.canComment = null;
            state.canCommentReason = null;
        })
        .addCase(checkCanCommentFunc.rejected, (state: CommentState, action) => {
            state.isLoadingCanComment = false;
            state.canComment = false;
            const errorPayload = action.payload as any;
            state.canCommentReason = errorPayload?.message || "Ошибка при проверке возможности комментирования";
        })
        .addCase(checkCanCommentFunc.fulfilled, (state: CommentState, action) => {
            state.isLoadingCanComment = false;
            state.canComment = action.payload.canComment;
            state.canCommentReason = action.payload.reason || null;
        });
};