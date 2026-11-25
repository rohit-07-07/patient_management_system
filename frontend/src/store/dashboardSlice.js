import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/dashboard/summary');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard summary');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    totalPatients: 0,
    totalBills: 0,
    totalPaidAmount: 0,
    totalPendingAmount: 0,
    recentPatients: [],
    loading: false,
    error: null
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.totalPatients = action.payload.totalPatients;
        state.totalBills = action.payload.totalBills;
        state.totalPaidAmount = action.payload.totalPaidAmount;
        state.totalPendingAmount = action.payload.totalPendingAmount;
        state.recentPatients = action.payload.recentPatients || [];
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
