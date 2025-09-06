import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {UserState} from "../interfaces/user.interface.ts";
import {
    authenticateHandler, getAllUsersHandler,
    getMeHandler, getProfileUserHandler,
    logoutHandler,
    registerHandler,
    verifyCodeHandler
} from "../handlers/user.handler.ts";

const initialState: UserState = {
    curUser: {},
    profileUser: {},
    isAuthenticated: false,
    token: localStorage.getItem("token") || "",
    users: [],

    isLoadingUser: false,
    isLoadingProfileUser: false,
    isLoadingAuthenticated: false,
    isLoadingVerify: false,
    isLoadingLogout: false,
    isLoadingUsers: false,

    errorUser: "",
    errorProfileUser: "",
    errorAuthenticated: "",
    errorVerify: "",
    errorLogout: "",
    errorUsers: "",

    successCode: false,
    successProfileUser: false,
    successUser: false,
    successAuth: false,
    successLogout: false,
    successUsers: false,
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
        getAllUsersHandler(builder);
        getProfileUserHandler(builder);
    },
});

export default userSlice.reducer;
