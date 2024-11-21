import { State } from "../types/state.types";

export const selectUser = (state: State) => state.auth.profile;

export const selectIsAdmin = (state: State) =>
  state.auth.profile?.subscription === "admin" ? true : false;

export const selectIsLoggedIn = (state: State) => state.auth.isLoggedIn;

export const selectIsLogining = (state: State) => state.auth.isLogining;

export const selectUserError = (state: State) => state.auth.error;

export const selectIsRefreshing = (state: State) => state.auth.isRefreshing;

export const selectPosts = (state: State) => state.posts.posts;

export const selectPost = (state: State) => state.posts.selectedPost;

export const selectIsLoading = (state: State) => state.posts.isLoading;

export const selectError = (state: State) => state.posts.error;
