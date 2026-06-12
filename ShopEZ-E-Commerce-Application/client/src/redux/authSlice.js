import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const saved = JSON.parse(localStorage.getItem("shopezAuth") || "null");

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return (await api.post("/auth/login", credentials)).data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Unable to log in");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (details, { rejectWithValue }) => {
  try {
    return (await api.post("/auth/register", details)).data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Unable to register");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { token: saved?.token || null, user: saved?.user || null, loading: false, error: null },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    for (const action of [loginUser, registerUser]) {
      builder
        .addCase(action.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(action.fulfilled, (state, { payload }) => {
          state.loading = false;
          state.token = payload.token;
          state.user = payload.user;
        })
        .addCase(action.rejected, (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        });
    }
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
