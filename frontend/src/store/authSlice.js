import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';

const storedUser = localStorage.getItem('carepulse_user');
const storedToken = localStorage.getItem('carepulse_token');

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/register', { name, email, password });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('carepulse_user');
      localStorage.removeItem('carepulse_token');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('carepulse_user', JSON.stringify(action.payload.user));
        localStorage.setItem('carepulse_token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('carepulse_user', JSON.stringify(action.payload.user));
        localStorage.setItem('carepulse_token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
