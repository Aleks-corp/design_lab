import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RootState } from "../store";
import { UserProfile } from "../../types/auth.types";

export const instance = axios.create({
  baseURL: "https://connections-api.herokuapp.com/",
});

export const setToken = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const delToken = () => {
  instance.defaults.headers.common["Authorization"] = "";
};

export const signUp = createAsyncThunk(
  "auth/signup",
  async (userData: UserProfile, thunkAPI) => {
    try {
      const response = await instance.post("/users/signup", userData);
      setToken(response.data.token);
      toast.success("Congratulations! You are successfully signed up!");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // error.response.data.code === 11000
        //   ? toast.error(
        //       `Email: ${error.response.data.keyValue.email} is registered. Please try another or Login.`
        //     )
        //   : toast.error(
        //       `${
        //         error.response.data.message ?? error.message
        //       }. Please try again.`
        //     );
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/login",
  async (userData: UserProfile, thunkAPI) => {
    try {
      const response = await instance.post("/users/login", userData);
      setToken(response.data.token);
      toast.success("You are successfully logged in!");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Email or password in not valid. Please try again.`);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await instance.post("/users/logout");
    toast.success("You are logged out!");
    delToken();
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`${error.message}. Please reload page.`);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
});

export const refreshUser = createAsyncThunk<
  UserProfile,
  void,
  { state: RootState }
>("auth/refresh", async (_, thunkAPI) => {
  const state: RootState = thunkAPI.getState();
  const persistedToken = state.auth.token;

  if (persistedToken === null) {
    return thunkAPI.rejectWithValue("Unable to Login");
  }

  try {
    setToken(persistedToken);
    const response = await instance.get("/users/current");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`${error.message}. Please try login.`);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
});
