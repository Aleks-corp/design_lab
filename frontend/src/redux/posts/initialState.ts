import { PostsState } from "../../types/state.types";

export const initialState: PostsState = {
  posts: [],
  totalHits: 0,
  selectedPost: null,
  isLoading: false,
  error: null,
};
