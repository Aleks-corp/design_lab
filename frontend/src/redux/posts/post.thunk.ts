import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddFavorites, AddPost } from "../../types/posts.types";
import { setAxiosBaseUrl } from "../../helpers/setAxiosBaseUrl";

const host = await setAxiosBaseUrl();
axios.defaults.baseURL = host;

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/posts");
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
      const response = await axios.get(`/posts/${id}`);
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
  async (post: AddPost, thunkAPI) => {
    try {
      const response = await axios.post("/posts", post);
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const addRemoveFavorites = createAsyncThunk(
  "posts/favorites",
  async (favorites: AddFavorites, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/posts/${favorites.postId}`,
        favorites.userId
      );
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
//       const response = await axios.patch(`/tasks/${task.id}`, task);
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
      await axios.delete(`/posts/${id}`);
      return id;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);
