import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { RootState } from "../store";
import {
  UserLogProfile,
  UserProfile,
  UserRegProfile,
} from "../../types/auth.types";
import { delToken, instance, setToken } from "../../api/axios";

export const signUp = createAsyncThunk(
  "auth/signup",
  async (userData: UserRegProfile, thunkAPI) => {
    try {
      const response = await instance.post("/users/register", userData);
      toast.success("Congratulations! You are successfully signed up!");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("error:", error);
        if (error.response?.status === 409) {
          const data = JSON.parse(error.response.config.data);
          toast.error(
            `Email: ${data.email} is registered. Please try another or Login.`
          );
        } else {
          toast.error(`${error.response?.data.message ?? error.message}`);
        }

        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/login",
  async (userData: UserLogProfile, thunkAPI) => {
    try {
      const response = await instance.post("/users/login", userData);
      setToken(response.data.token);
      toast.success("You are successfully logged in!");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          `${error.response?.data.message ?? error.message} Please try again.`
        );
        return thunkAPI.rejectWithValue(error.response ?? error.message);
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
    if (error instanceof AxiosError) {
      toast.error(
        `${error.response?.data.message ?? error.message}. Please reload page.`
      );
      return thunkAPI.rejectWithValue(
        error.response?.data.message ?? error.message
      );
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
    if (error instanceof AxiosError) {
      // toast.error(
      //   `${error.response?.data.message ?? error.message}. Please try login.`
      // );
      return thunkAPI.rejectWithValue(
        error.response?.data.message ?? error.message
      );
    }
  }
});

export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (verificationToken: string, thunkAPI) => {
    try {
      const response = await instance.get(`/users/verify/${verificationToken}`);
      setToken(response.data.token);
      toast.success("You are successfully logged in!");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // toast.error(`Email or password in not valid. Please try again.`);
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const resendVerifyUser = createAsyncThunk(
  "auth/verify",
  async (userData: { email: string }, thunkAPI) => {
    try {
      const response = await instance.post(`/users/verify`, userData);
      // setToken(response.data.token);
      toast.success("Email sent");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);
