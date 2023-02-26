import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},

  //! Стани загрузок
  extraReducers: {
    //! Отримання статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      // якщо статус pending то ми в нашому стейті відображаєм завантаження елемементів
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      // якщо статус fulfilled то ми в нашому стейті завершуєм загрузку
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      // якщо статус rejected то ми в нашому стейті відображаєм помилку
      state.posts.status = "error";
    },
    //! Отримання тегів
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      // якщо статус pending то ми в нашому стейті відображаєм завантаження елемементів
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      // якщо статус fulfilled то ми в нашому стейті завершуєм загрузку
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      // якщо статус rejected то ми в нашому стейті відображаєм помилку
      state.tags.status = "error";
    },
    //! Видалення статей
    [fetchRemovePost.pending]: (state, action) => {
      //! Коротко часне видалення статі
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
  },
});

export const postsReducer = postsSlice.reducer;
