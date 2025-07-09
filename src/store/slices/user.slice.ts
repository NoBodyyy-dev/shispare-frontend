import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {UserState} from "../interfaces/user.interface.ts";
import {
    authenticateHandler,
    getMeHandler,
    logoutHandler,
    registerHandler,
    verifyCodeHandler
} from "../handlers/user.handler.ts";

const initialState: UserState = {
    curUser: {},
    isAuthenticated: false,
    token: localStorage.getItem("token") || "",

    isLoadingUser: false,
    isLoadingAuthenticated: false,
    isLoadingVerify: false,
    isLoadingLogout: false,

    errorUser: "",
    errorAuthenticated: "",
    errorVerify: "",
    errorLogout: "",

    successCode: false,
    successUser: false,
    successAuth: false,
    successLogout: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
        getMeHandler(builder);
        authenticateHandler(builder);
        registerHandler(builder);
        verifyCodeHandler(builder);
        logoutHandler(builder);
    },
});

export default userSlice.reducer;
