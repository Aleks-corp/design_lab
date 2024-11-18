import { PostsState } from "../../types/state.types";

export const initialState: PostsState = {
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
};
