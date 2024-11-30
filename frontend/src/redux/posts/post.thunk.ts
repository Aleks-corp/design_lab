import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddFavorites } from "../../types/posts.types";
import { instance } from "../../api/axios";
import { AxiosError } from "axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get("/posts");
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id: string, thunkAPI) => {
    try {
      const response = await instance.get(`/posts/${id}`);
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (data: FormData, thunkAPI) => {
    try {
      const response = await instance.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response ?? error.message);
      }
    }
  }
);

export const addRemoveFavorites = createAsyncThunk(
  "posts/favorites",
  async (favorites: AddFavorites, thunkAPI) => {
    try {
      const response = await instance.patch(`/posts/${favorites.postId}`, {
        userId: favorites.userId,
      });

      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

// export const updateTask = createAsyncThunk(
//   "tasks/updateTask",
//   async (task: UpdateTask, thunkAPI) => {
//     try {
//       const response = await instance.patch(`/tasks/${task.id}`, task);
//       return response.data;
//     } catch (e) {
//       if (e instanceof Error) {
//         return thunkAPI.rejectWithValue(e.message);
//       }
//     }
//   }
// );

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: string, thunkAPI) => {
    try {
      await instance.delete(`/posts/${id}`);
      return id;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);
