import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PostsState } from "../../types/state.types";
import {
  fetchPosts,
  fetchPostById,
  addPost,
  addRemoveFavorites,
  deletePost,
} from "./post.thunk";
import { GetPost } from "../../types/posts.types";
import { initialState } from "./initialState";

const handlePending = (state: PostsState) => {
  state.isLoading = true;
};
const handleRejected = (state: PostsState, action: PayloadAction<Error>) => {
  state.isLoading = false;
  state.error = action.payload;
};

const handleFulfilled = (state: PostsState) => {
  state.error = null;
  state.isLoading = false;
};

export const handleFulfilledPosts = (
  state: PostsState,
  action: PayloadAction<GetPost[]>
): void => {
  state.posts = action.payload;
};

export const handleFulfilledPostById = (
  state: PostsState,
  action: PayloadAction<GetPost>
): void => {
  state.selectedPost = action.payload;
};

export const handleFulfilledAddPost = (
  state: PostsState,
  action: PayloadAction<GetPost>
): void => {
  state.posts.push({ ...action.payload });
  state.selectedPost = { ...action.payload };
};

export const handleFulfilledAddFavorites = (
  state: PostsState,
  action: PayloadAction<GetPost>
): void => {
  const updatedBoard = action.payload;
  const index = state.posts.findIndex((board) => board.id === updatedBoard.id);
  if (index !== -1) {
    state.posts.splice(index, 1, updatedBoard);
  }
  if (state.selectedPost) {
    state.selectedPost.name = updatedBoard.name;
  }
};

export const handleFulfilledDeletePost = (
  state: PostsState,
  action: PayloadAction<string | undefined>
): void => {
  const postIndex = state.posts.findIndex((item) => item.id === action.payload);
  if (postIndex !== -1) {
    state.posts.splice(postIndex, 1);
  }
  state.selectedPost = null;
};

const postsSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, handleFulfilledPosts)
      .addCase(fetchPostById.fulfilled, handleFulfilledPostById)
      .addCase(addPost.fulfilled, handleFulfilledAddPost)
      .addCase(addRemoveFavorites.fulfilled, handleFulfilledAddFavorites)
      .addCase(deletePost.fulfilled, handleFulfilledDeletePost)
      .addMatcher(
        ({ type }) => type.endsWith("/pending") && type.startsWith("posts"),
        handlePending
      )
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("posts"),
        handleRejected
      )
      .addMatcher(
        (action) => action.type.endsWith("fulfilled"),
        handleFulfilled
      );
  },
});

export const postsReducer = postsSlice.reducer;
