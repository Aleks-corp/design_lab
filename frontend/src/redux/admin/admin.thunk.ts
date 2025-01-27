import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/auth.types";
import { instance } from "../../api/axios";

export const getAllUsers = createAsyncThunk(
  "admin/getallusers",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get("/admin/users");
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const patchUser = createAsyncThunk(
  "admin/updateuser",
  async (userData: UserProfile, thunkAPI) => {
    try {
      const response = await instance.patch(
        `/admin/user/${userData.id}`,
        userData
      );
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const getUnpublishedPosts = createAsyncThunk(
  "admin/getunpublposts",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get("/admin/posts");
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);
