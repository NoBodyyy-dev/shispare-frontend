import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {UserState} from "../interfaces/user.interface.ts";
import {
    authenticateFunc,
    banUserFunc,
    getAllUsersFunc,
    getMeFunc, getProfileUserFunc,
    logoutFunc,
    registerFunc,
    verifyCodeFunc
} from "../actions/user.action.ts";

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

export const getAllUsersHandler = (builder: ActionReducerMapBuilder<UserState>) => {
    builder
        .addCase(getAllUsersFunc.pending, (state: UserState) => {
            state.isLoadingUsers = true;
        })
        .addCase(getAllUsersFunc.rejected, (state: UserState, action) => {
            state.isLoadingUsers = false;
            state.errorUsers = action.error.message!;
        })
        .addCase(getAllUsersFunc.fulfilled, (state: UserState, action) => {
            state.isLoadingUsers = false;
            state.users = action.payload.users;
        })
}

export const getProfileUserHandler = (builder: ActionReducerMapBuilder<UserState>) => {
    builder
        .addCase(getProfileUserFunc.pending, (state: UserState) => {
            state.isLoadingProfileUser = true;
        })
        .addCase(getProfileUserFunc.rejected, (state: UserState, action) => {
            state.isLoadingProfileUser = false;
            state.errorProfileUser = action.error.message!;
        })
        .addCase(getProfileUserFunc.fulfilled, (state: UserState, action) => {
            state.isLoadingProfileUser = false;
            state.profileUser = action.payload.user;
        })
}

export const banUserHandler = (builder: ActionReducerMapBuilder<UserState>) => {
    builder
        .addCase(banUserFunc.pending, (state: UserState) => {
            // Можно добавить состояние загрузки, если нужно
        })
        .addCase(banUserFunc.rejected, (state: UserState, action) => {
            // Обработка ошибки
            console.error('Ошибка бана пользователя:', action.error);
        })
        .addCase(banUserFunc.fulfilled, (state: UserState, action) => {
            const userId = action.payload.user._id || action.payload.user.id;
            // Обновляем пользователя в профиле
            if (state.profileUser && (state.profileUser._id === userId || state.profileUser._id?.toString() === userId?.toString())) {
                state.profileUser.banned = action.payload.user.banned;
            }
            // Обновляем в списке пользователей
            const userIndex = state.users.findIndex(u => u._id === userId || u._id?.toString() === userId?.toString());
            if (userIndex !== -1) {
                state.users[userIndex].banned = action.payload.user.banned;
            }
        })
}


