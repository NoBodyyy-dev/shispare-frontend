import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { UserState } from "../interfaces/user.interface.ts";

const initialState: UserState = {
  curUser: {},
  token: localStorage.getItem("token") || "",
  isLoading: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {

  },
});

export default userSlice.reducer;
