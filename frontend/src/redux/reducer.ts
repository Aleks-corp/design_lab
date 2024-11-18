import { authReducer } from "./auth/authSlice";
import { postsReducer } from "./posts/postSlice";

export const reducer = {
  auth: authReducer,
  posts: postsReducer,
};
