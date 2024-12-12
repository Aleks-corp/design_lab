import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  signUp,
  logIn,
  logOut,
  refreshUser,
  verifyUser,
  resendVerifyUser,
  setNewPassword,
  forgotPassword,
  changePassword,
} from "./auth.thunk";
import { AuthState } from "../../types/state.types";
import { GetUser, UserProfile } from "../../types/auth.types";

const handleFulfilled = (state: AuthState) => {
  state.isLogining = false;
  state.isLoggedIn = true;
};

const handleLoginFulfilled = (
  state: AuthState,
  action: PayloadAction<GetUser>
) => {
  state.isLogining = false;
  state.token = action.payload.token;
  state.profile = action.payload.user;
  state.isLoggedIn = true;
};

const handleSighUpFulfilled = (state: AuthState) => {
  state.isLogining = false;
};

const handleLogOutFulfilled = (state: AuthState) => {
  state.isLogining = false;
  state.profile = null;
  state.token = "";
  state.isLoggedIn = false;
};

const handleRefreshFulfilled = (
  state: AuthState,
  action: PayloadAction<UserProfile>
) => {
  state.isLogining = false;
  state.profile = action.payload;
  state.isLoggedIn = true;
  state.isRefreshing = false;
};
const handleRefreshPending = (state: AuthState) => {
  state.isRefreshing = true;
};
const handleRefreshRejected = (state: AuthState) => {
  state.isRefreshing = false;
  state.token = "";
};

const handleRejected = (state: AuthState, action: PayloadAction<Error>) => {
  state.isLogining = false;
  state.error = action.payload;
};

const handlePending = (state: AuthState) => {
  state.isLogining = true;
  state.error = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(signUp.fulfilled, handleSighUpFulfilled)
      .addCase(logIn.fulfilled, handleLoginFulfilled)
      .addCase(logOut.fulfilled, handleLogOutFulfilled)
      .addCase(verifyUser.fulfilled, handleLoginFulfilled)
      .addCase(resendVerifyUser.fulfilled, handleFulfilled)
      .addCase(setNewPassword.fulfilled, handleFulfilled)
      .addCase(forgotPassword.fulfilled, handleFulfilled)
      .addCase(changePassword.fulfilled, handleFulfilled)
      .addCase(refreshUser.fulfilled, handleRefreshFulfilled)
      .addCase(refreshUser.pending, handleRefreshPending)
      .addCase(refreshUser.rejected, handleRefreshRejected)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("auth"),
        handleRejected
      )
      .addMatcher(
        ({ type }) => type.endsWith("/pending") && type.startsWith("auth"),
        handlePending
      ),
});

export const authReducer = authSlice.reducer;
