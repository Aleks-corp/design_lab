import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../api/axios";
import { AxiosError } from "axios";
import { AddPost } from "../../types/posts.types";

interface Query {
  page?: number;
  limit?: number;
  filter?: string;
  favorites?: boolean;
  search?: string;
}

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    {
      page = 1,
      limit = 12,
      filter = "",
      favorites = false,
      search = "",
    }: Query,
    thunkAPI
  ) => {
    try {
      const response = await instance.get(
        `/posts?page=${page}&limit=${limit}${
          filter ? `&filter=${filter}` : ``
        }${favorites ? `&favorites=${favorites}` : ``}${
          search ? `&search=${search}` : ``
        }`
      );
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
  async (data: AddPost, thunkAPI) => {
    try {
      const response = await instance.post("/posts", data);
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
  async (postId: string, thunkAPI) => {
    try {
      const response = await instance.patch(`/posts`, {
        postId,
      });

      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

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
