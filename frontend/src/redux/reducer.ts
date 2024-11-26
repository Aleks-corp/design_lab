import persistReducer from "redux-persist/es/persistReducer";
import { authReducer } from "./auth/authSlice";
import { postsReducer } from "./posts/postSlice";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "token",
  storage,
  whitelist: ["token"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const reducer = {
  auth: persistedReducer,
  posts: postsReducer,
};
