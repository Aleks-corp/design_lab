import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  getAllUsers,
  patchUser,
  patchUsers,
  banUsers,
  getUnpublishedPosts,
  getUnpublishedPostById,
  patchCheckSub,
  sendMessageSpt,
} from "./admin.thunk";
import { AdminState } from "../../types/state.types";
import { GetPost } from "../../types/posts.types";
import { UserProfile } from "../../types/auth.types";
import toast from "react-hot-toast";

const handleGetAllUsersPending = (state: AdminState) => {
  state.isLoadingMore = true;
  state.error = "";
};

const handlePatchUsersPending = (state: AdminState) => {
  state.isLoadingUpdate = true;
  state.error = "";
};

const handlePatchCheckSubPending = (state: AdminState) => {
  state.isLoadingCheck = true;
  state.error = "";
};

const handlePostsPending = (state: AdminState) => {
  state.isLoadingPost = true;
  state.error = "";
};

const handleGetAllUsersFulfilled = (
  state: AdminState,
  action: PayloadAction<{
    users: UserProfile[];
    totalHits: number;
    page?: number;
  }>
) => {
  state.isLoadingMore = false;
  const { users, totalHits, page = 1 } = action.payload;
  if (page > 1) {
    const newUsers = users.filter(
      (newUser) =>
        !state.folowers.some((existingUser) => existingUser._id === newUser._id)
    );
    state.folowers = [...state.folowers, ...newUsers];
  } else {
    // A fresh query (initial load, or a new search) — replace rather than
    // append, otherwise stale results from a previous search would linger.
    state.folowers = users;
  }
  state.totalFolowers = totalHits;
};

const mergeUpdatedUsers = (
  state: AdminState,
  updatedUsers: UserProfile[]
) => {
  updatedUsers.forEach((updated) => {
    const index = state.folowers.findIndex((i) => i._id === updated._id);
    if (index !== -1) {
      state.folowers.splice(index, 1, updated);
    }
  });
};

const handlePatchUserFulfilled = (
  state: AdminState,
  action: PayloadAction<UserProfile>
) => {
  state.isLoadingUpdate = false;
  if (action.payload) {
    mergeUpdatedUsers(state, [action.payload]);
  }
};

const handlePatchUsersFulfilled = (
  state: AdminState,
  action: PayloadAction<{ users: UserProfile[] }>
) => {
  state.isLoadingUpdate = false;
  // Only patch the users that were actually acted on — the admin can have
  // far more than a "first 100" slice loaded, and replacing the whole list
  // with a partial batch used to drop everyone else off the screen.
  mergeUpdatedUsers(state, action.payload.users);
};

const handlePatchCheckSubFulfilled = (
  state: AdminState,
  action: PayloadAction<{ users: UserProfile[] }>
) => {
  state.isLoadingCheck = false;
  mergeUpdatedUsers(state, action.payload.users);
};

const handleGetUnpublishedPostsFulfilled = (
  state: AdminState,
  action: PayloadAction<{ posts: GetPost[]; totalHits: number; page?: number }>
) => {
  state.isLoadingPost = false;
  const { posts, totalHits, page = 1 } = action.payload;
  if (page > 1) {
    const newPosts = posts.filter(
      (p) => !state.unpublPosts.some((existing) => existing._id === p._id)
    );
    state.unpublPosts = [...state.unpublPosts, ...newPosts];
  } else {
    state.unpublPosts = posts;
  }
  state.totalPosts = totalHits;
};

const handleGetUnpublishedPostsByIdFulfilled = (
  state: AdminState,
  action: PayloadAction<GetPost>
) => {
  state.isLoadingPost = false;
  state.unpublPost = action.payload;
};

const handleSendMessageSptPending = (state: AdminState) => {
  state.error = "";
};
const handleSendMessageSptFulfilled = (
  state: AdminState,
  action: PayloadAction<string>
) => {
  if (action.payload === "Message sent") {
    toast.success(action.payload);
  } else {
    toast.error("Message not sent, please try again");
  }
  state.error = "";
};

const handleRejected = (state: AdminState, action: PayloadAction<string>) => {
  state.isLoadingPost = false;
  state.isLoadingCheck = false;
  state.isLoadingUpdate = false;
  state.isLoadingMore = false;
  state.error = action.payload;
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllUsers.pending, handleGetAllUsersPending)
      .addCase(getAllUsers.fulfilled, handleGetAllUsersFulfilled)
      .addCase(patchUser.pending, handlePatchUsersPending)
      .addCase(patchUser.fulfilled, handlePatchUserFulfilled)
      .addCase(patchUsers.pending, handlePatchUsersPending)
      .addCase(patchUsers.fulfilled, handlePatchUsersFulfilled)
      .addCase(banUsers.pending, handlePatchUsersPending)
      .addCase(banUsers.fulfilled, handlePatchUsersFulfilled)
      .addCase(patchCheckSub.pending, handlePatchCheckSubPending)
      .addCase(patchCheckSub.fulfilled, handlePatchCheckSubFulfilled)
      .addCase(getUnpublishedPosts.pending, handlePostsPending)
      .addCase(
        getUnpublishedPosts.fulfilled,
        handleGetUnpublishedPostsFulfilled
      )
      .addCase(getUnpublishedPostById.pending, handlePostsPending)
      .addCase(
        getUnpublishedPostById.fulfilled,
        handleGetUnpublishedPostsByIdFulfilled
      )
      .addCase(sendMessageSpt.pending, handleSendMessageSptPending)
      .addCase(sendMessageSpt.fulfilled, handleSendMessageSptFulfilled)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("admin"),
        handleRejected
      ),
});

export const adminReducer = adminSlice.reducer;
