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
  checkPaymentStatus,
} from "./auth.thunk";
import { AuthState } from "../../types/state.types";
import { GetUser, UserProfile } from "../../types/auth.types";

const handleFulfilled = (state: AuthState) => {
  state.isLoggedIn = true;
  state.isLogining = false;
};

const handleLoginFulfilled = (
  state: AuthState,
  action: PayloadAction<GetUser>
) => {
  state.isLoggedIn = true;
  state.token = action.payload.token;
  state.profile = action.payload.user;
  state.isLogining = false;
};

const handleSighUpFulfilled = (state: AuthState) => {
  state.isLogining = false;
};

const handleLogOutFulfilled = (state: AuthState) => {
  state.isLoggedIn = false;
  state.profile = null;
  state.token = "";
  state.isLogining = false;
};

const handleVerifyUserFulfilled = (state: AuthState) => {
  state.isLogining = false;
};

const handleCheckPaymentFulfilled = (
  state: AuthState,
  action: PayloadAction<{ subscription: string }>
) => {
  state.isLogining = false;
  if (state.profile) {
    state.profile.subscription = action.payload.subscription;
  }
};

const handleRefreshPending = (state: AuthState) => {
  state.isRefreshing = true;
};

const handleRefreshFulfilled = (
  state: AuthState,
  action: PayloadAction<UserProfile>
) => {
  state.profile = action.payload;
  state.isLoggedIn = true;
  state.isLogining = false;
  state.isRefreshing = false;
};

const handleRefreshRejected = (
  state: AuthState,
  action: PayloadAction<unknown, string>
) => {
  if (action.payload !== "Network Error") {
    state.token = "";
  }
  state.isRefreshing = false;
};

const handleRejected = (state: AuthState, action: PayloadAction<string>) => {
  state.error = action.payload;
  state.isLogining = false;
};

const handlePending = (state: AuthState) => {
  state.isLogining = true;
  state.error = "";
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
      .addCase(verifyUser.fulfilled, handleVerifyUserFulfilled)
      .addCase(resendVerifyUser.fulfilled, handleFulfilled)
      .addCase(setNewPassword.fulfilled, handleFulfilled)
      .addCase(forgotPassword.fulfilled, handleFulfilled)
      .addCase(changePassword.fulfilled, handleFulfilled)
      .addCase(checkPaymentStatus.fulfilled, handleCheckPaymentFulfilled)
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
