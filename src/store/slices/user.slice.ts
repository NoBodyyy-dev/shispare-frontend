import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {UserState} from "../interfaces/user.interface.ts";
import {
    authenticateHandler, banUserHandler, getAllUsersHandler, getAllStaffHandler,
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
    staff: [],

    isLoadingUser: false,
    isLoadingProfileUser: false,
    isLoadingAuthenticated: false,
    isLoadingVerify: false,
    isLoadingLogout: false,
    isLoadingUsers: false,
    isLoadingStaff: false,

    errorUser: "",
    errorProfileUser: "",
    errorAuthenticated: "",
    errorVerify: "",
    errorLogout: "",
    errorUsers: "",
    errorStaff: "",

    successCode: false,
    successProfileUser: false,
    successUser: false,
    successAuth: false,
    successLogout: false,
    successUsers: false,
    successStaff: false,
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
        getAllStaffHandler(builder);
        getProfileUserHandler(builder);
        banUserHandler(builder);
    },
});

export default userSlice.reducer;
