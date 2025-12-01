import {createSlice, ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {RequestState} from "../interfaces/request.interface.ts";
import {
    createRequestHandler,
    getAllRequestsHandler,
    getRequestByIdHandler,
    answerRequestHandler
} from "../handlers/request.handler.ts";

const initialState: RequestState = {
    requests: [],
    currentRequest: null,
    isLoadingRequests: false,
    isLoadingRequest: false,
    isLoadingCreateRequest: false,
    isLoadingAnswerRequest: false,
    successRequests: false,
    successCreateRequest: false,
    successAnswerRequest: false,
    errorRequests: "",
    errorRequest: "",
    errorCreateRequest: "",
    errorAnswerRequest: "",
};

const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<RequestState>) => {
        createRequestHandler(builder);
        getAllRequestsHandler(builder);
        getRequestByIdHandler(builder);
        answerRequestHandler(builder);
    },
});

export default requestSlice.reducer;
