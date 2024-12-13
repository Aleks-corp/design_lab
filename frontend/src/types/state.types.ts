import { UserProfile } from "./auth.types";
import { GetPost } from "./posts.types";

export interface State {
  posts: PostsState;
  auth: AuthState;
}

export interface PostsState {
  posts: GetPost[];
  totalHits: number;
  currentFilter: string;
  selectedPost: GetPost | null;
  isLoading: boolean;
  error: string;
}

export interface AuthState {
  token: string;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  isLogining: boolean;
  error: string;
  profile: UserProfile | null;
}
