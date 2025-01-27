import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { getAllUsers, patchUser, getUnpublishedPosts } from "./admin.thunk";
import { AdminState } from "../../types/state.types";
import { GetPost } from "../../types/posts.types";
import { UserList } from "../../types/auth.types";

const handleGetAllUsersFulfilled = (
  state: AdminState,
  action: PayloadAction<{ users: UserList[]; totalHits: number }>
) => {
  state.isLogining = false;
  const newUsers = action.payload.users.filter(
    (newUser) =>
      !state.folowers.some((existingUser) => existingUser._id === newUser._id)
  );
  state.folowers = [...state.folowers, ...newUsers];
  state.totalHits = action.payload.totalHits;
};

const handlePatchUserFulfilled = (
  state: AdminState,
  action: PayloadAction<UserList>
) => {
  state.isLogining = false;
  const index = state.folowers.findIndex((i) => action.payload._id === i._id);
  state.folowers.splice(index, 1, action.payload);
};

const handleGetUnpublishedPostsFulfilled = (
  state: AdminState,
  action: PayloadAction<GetPost[]>
) => {
  state.isLogining = false;
  state.unpublPosts = action.payload;
};

const handleRejected = (state: AdminState, action: PayloadAction<string>) => {
  state.isLogining = false;
  state.error = action.payload;
};

const handlePending = (state: AdminState) => {
  state.isLogining = true;
  state.error = "";
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllUsers.fulfilled, handleGetAllUsersFulfilled)
      .addCase(patchUser.fulfilled, handlePatchUserFulfilled)
      .addCase(
        getUnpublishedPosts.fulfilled,
        handleGetUnpublishedPostsFulfilled
      )
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("admin"),
        handleRejected
      )
      .addMatcher(
        ({ type }) => type.endsWith("/pending") && type.startsWith("admin"),
        handlePending
      ),
});

export const adminReducer = adminSlice.reducer;
