import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  getAllUsers,
  patchUser,
  patchUsers,
  getUnpublishedPosts,
  getUnpublishedPostById,
} from "./admin.thunk";
import { AdminState } from "../../types/state.types";
import { GetPost } from "../../types/posts.types";
import { UserList } from "../../types/auth.types";

const handleGetAllUsersFulfilled = (
  state: AdminState,
  action: PayloadAction<{ users: UserList[]; totalHits: number }>
) => {
  state.isLoading = false;
  const newUsers = action.payload.users.filter(
    (newUser) =>
      !state.folowers.some((existingUser) => existingUser._id === newUser._id)
  );
  state.folowers = [...state.folowers, ...newUsers];
  state.totalFolowers = action.payload.totalHits;
};

const handlePatchUserFulfilled = (
  state: AdminState,
  action: PayloadAction<UserList>
) => {
  state.isLoading = false;
  const index = state.folowers.findIndex((i) => action.payload._id === i._id);
  state.folowers.splice(index, 1, action.payload);
};

const handlePatchUsersFulfilled = (
  state: AdminState,
  action: PayloadAction<UserList[]>
) => {
  state.isLoading = false;
  state.folowers = action.payload;
};

const handleGetUnpublishedPostsFulfilled = (
  state: AdminState,
  action: PayloadAction<{ posts: GetPost[]; totalHits: number }>
) => {
  state.isLoading = false;
  state.unpublPosts = action.payload.posts;
  state.totalPosts = action.payload.totalHits;
};

const handleGetUnpublishedPostsByIdFulfilled = (
  state: AdminState,
  action: PayloadAction<GetPost>
) => {
  state.isLoading = false;
  state.unpublPost = action.payload;
};

const handleRejected = (state: AdminState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = action.payload;
};

const handlePending = (state: AdminState) => {
  state.isLoading = true;
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
      .addCase(patchUsers.fulfilled, handlePatchUsersFulfilled)
      .addCase(
        getUnpublishedPosts.fulfilled,
        handleGetUnpublishedPostsFulfilled
      )
      .addCase(
        getUnpublishedPostById.fulfilled,
        handleGetUnpublishedPostsByIdFulfilled
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
