import { UserList, UserProfile } from "./auth.types";
import { GetPost } from "./posts.types";

export interface State {
  posts: PostsState;
  auth: AuthState;
  admin: AdminState;
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

export interface AdminState {
  folowers: UserList[];
  totalFolowers: number;
  totalPosts: number;
  unpublPosts: GetPost[];
  unpublPost: GetPost | null;
  isLoading: boolean;
  error: string;
}
