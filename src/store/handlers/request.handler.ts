import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {IRequest, RequestState} from "../interfaces/request.interface.ts";
import * as actions from "../actions/request.action.ts";

export const createRequestHandler = (builder: ActionReducerMapBuilder<RequestState>) => {
    builder
        .addCase(actions.createRequestFunc.pending, (state: RequestState) => {
            state.isLoadingCreateRequest = true;
            state.errorCreateRequest = "";
        })
        .addCase(actions.createRequestFunc.fulfilled, (state: RequestState) => {
            state.isLoadingCreateRequest = false;
            state.successCreateRequest = true;
        })
        .addCase(actions.createRequestFunc.rejected, (state: RequestState, action) => {
            state.isLoadingCreateRequest = false;
            state.errorCreateRequest = action.error.message || "Ошибка при отправке заявки";
            state.successCreateRequest = false;
        });
};

export const getAllRequestsHandler = (builder: ActionReducerMapBuilder<RequestState>) => {
    builder
        .addCase(actions.getAllRequestsFunc.pending, (state: RequestState) => {
            state.isLoadingRequests = true;
            state.errorRequests = "";
        })
        .addCase(actions.getAllRequestsFunc.fulfilled, (state: RequestState, action) => {
            state.isLoadingRequests = false;
            state.requests = action.payload.requests || [];
            state.successRequests = true;
        })
        .addCase(actions.getAllRequestsFunc.rejected, (state: RequestState, action) => {
            state.isLoadingRequests = false;
            state.errorRequests = action.error.message || "Ошибка при загрузке заявок";
            state.successRequests = false;
        });
};

export const getRequestByIdHandler = (builder: ActionReducerMapBuilder<RequestState>) => {
    builder
        .addCase(actions.getRequestByIdFunc.pending, (state: RequestState) => {
            state.isLoadingRequest = true;
            state.errorRequest = "";
        })
        .addCase(actions.getRequestByIdFunc.fulfilled, (state: RequestState, action) => {
            state.isLoadingRequest = false;
            state.currentRequest = action.payload.request || action.payload.data || null;
        })
        .addCase(actions.getRequestByIdFunc.rejected, (state: RequestState, action) => {
            state.isLoadingRequest = false;
            state.errorRequest = action.error.message || "Ошибка при загрузке заявки";
            state.currentRequest = null;
        });
};

export const answerRequestHandler = (builder: ActionReducerMapBuilder<RequestState>) => {
    builder
        .addCase(actions.answerRequestFunc.pending, (state: RequestState) => {
            state.isLoadingAnswerRequest = true;
            state.errorAnswerRequest = "";
            state.successAnswerRequest = false;
        })
        .addCase(actions.answerRequestFunc.fulfilled, (state: RequestState, action) => {
            state.isLoadingAnswerRequest = false;
            state.successAnswerRequest = true;
            // Обновляем заявку в списке
            const updatedRequest = action.payload.request || action.payload.data;
            if (updatedRequest && updatedRequest._id) {
                const index = state.requests.findIndex(r => r._id === updatedRequest._id);
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                } else {
                    // Если заявка не найдена в списке, добавляем её
                    state.requests.push(updatedRequest);
                }
                // Обновляем текущую заявку, если она открыта
                if (state.currentRequest && state.currentRequest._id === updatedRequest._id) {
                    state.currentRequest = updatedRequest;
                }
            }
        })
        .addCase(actions.answerRequestFunc.rejected, (state: RequestState, action) => {
            state.isLoadingAnswerRequest = false;
            state.errorAnswerRequest = (action.payload as any)?.message || action.error.message || "Ошибка при отправке ответа";
            state.successAnswerRequest = false;
        });
};
