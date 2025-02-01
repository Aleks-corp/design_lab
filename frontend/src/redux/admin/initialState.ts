import { AdminState } from "../../types/state.types";

export const initialState: AdminState = {
  folowers: [],
  totalFolowers: 0,
  totalPosts: 0,
  unpublPost: null,
  unpublPosts: [],
  isLoading: false,
  error: "",
};
