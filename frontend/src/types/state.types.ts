import { UserProfile } from "./auth.types";
import { GetPost } from "./posts.types";

export interface State {
  posts: PostsState;
  auth: AuthState;
}

export interface PostsState {
  posts: GetPost[];
  selectedPost: GetPost | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthState {
  token: string;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  isLogining: boolean;
  error: Error | null;
  profile: UserProfile | null;
}
