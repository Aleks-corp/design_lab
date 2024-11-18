import { AuthState } from "../../types/state.types";

export const initialState: AuthState = {
  token: "",
  isLoggedIn: false,
  isRefreshing: false,
  isLogining: false,
  error: null,
  profile: null,
};
