import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {UserState} from "../interfaces/user.interface.ts";
import {authenticateFunc, getMeFunc, logoutFunc, registerFunc, verifyCodeFunc} from "../actions/user.action.ts";

export const getMeHandler = (builder: ActionReducerMapBuilder<UserState>) => {
    builder
        .addCase(getMeFunc.pending, (state) => {
            state.isLoadingUser = true;
        })
        .addCase(getMeFunc.rejected, (state, action) => {
            state.isLoadingUser = false;
            state.errorUser = action.error.message;
        })
        .addCase(getMeFunc.fulfilled, (state, action) => {
            state.errorUser = "";
            state.isLoadingUser = false;
            state.curUser = action.payload.user;
            localStorage.setItem("token", action.payload.tokens.accessToken);
            state.isAuthenticated = true;
        })
}

export const registerHandler = (builder: ActionReducerMapBuilder<UserState>) => {
    builder
        .addCase(registerFunc.pending, (state) => {
            state.isLoadingAuthenticated = true;
        })
        .addCase(registerFunc.rejected, (state, action) => {
            state.isLoadingAuthenticated = false;
            state.errorAuthenticated = action.error.message!;
        })
        .addCase(registerFunc.fulfilled, (state) => {
            state.isLoadingAuthenticated = false;
            state.successAuth = true;
        });
}

export const authenticateHandler = (builder: ActionReducerMapBuilder<UserState>) => {
    builder
        .addCase(authenticateFunc.pending, (state) => {
            state.isLoadingAuthenticated = true;
        })
        .addCase(authenticateFunc.rejected, (state, action) => {
            state.isLoadingAuthenticated = false;
            state.errorAuthenticated = action.error.message!;
        })
        .addCase(authenticateFunc.fulfilled, (state) => {
            state.isLoadingAuthenticated = false;
            state.successAuth = true
        });
}

export const verifyCodeHandler = (builder: ActionReducerMapBuilder<UserState>) => {
    builder
        .addCase(verifyCodeFunc.pending, (state) => {
            state.isLoadingVerify = true;
        })
        .addCase(verifyCodeFunc.rejected, (state, action) => {
            state.isLoadingVerify = false;
            state.errorVerify = action.error.message!;
        })
        .addCase(verifyCodeFunc.fulfilled, (state, action) => {
            localStorage.setItem("token", action.payload.accessToken);
            state.successCode = true;
            state.isLoadingVerify = false;
            state.isAuthenticated = true;
        })
}

export const logoutHandler = (builder: ActionReducerMapBuilder<UserState>) => {
    builder
        .addCase(logoutFunc.pending, (state) => {
            state.isLoadingLogout = true;
        })
        .addCase(logoutFunc.rejected, (state, action) => {
            state.isLoadingLogout = false;
            state.errorLogout = action.error.message!;
        })
        .addCase(logoutFunc.fulfilled, (state) => {
            state.isLoadingLogout = false;
            state.curUser = {};
            state.isAuthenticated = false;
            state.token = "";
            localStorage.clear();
        })
}
