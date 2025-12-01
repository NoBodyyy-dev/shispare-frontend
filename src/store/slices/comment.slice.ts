import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {CommentState} from "../interfaces/comment.interface.ts";
import {
    createCommentHandler,
    deleteCommentHandler,
    getProductCommentsHandler,
    getCommentByIdHandler,
    getMyCommentsHandler,
    getUserCommentsHandler,
    checkCanCommentHandler
} from "../handlers/comment.handler.ts"

const initialState: CommentState = {
    comments: [],
    pagination: null,
    isLoadingActionComment: false,
    isLoadingComments: false,
    errorActionComment: "",
    errorComments: "",
    canComment: null,
    canCommentReason: null,
    isLoadingCanComment: false,
};

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {},
    extraReducers(builder: ActionReducerMapBuilder<CommentState>) {
        createCommentHandler(builder);
        deleteCommentHandler(builder);
        getProductCommentsHandler(builder);
        getCommentByIdHandler(builder);
        getUserCommentsHandler(builder);
        getMyCommentsHandler(builder);
        checkCanCommentHandler(builder);
    }
});

export default commentSlice.reducer;