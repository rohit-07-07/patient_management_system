import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';

export const fetchBills = createAsyncThunk(
  'billing/fetchBills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/bills');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bills');
    }
  }
);

export const fetchBillById = createAsyncThunk(
  'billing/fetchBillById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/bills/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bill details');
    }
  }
);

export const createBill = createAsyncThunk(
  'billing/createBill',
  async (billData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/bills', billData);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create bill';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

export const updateBill = createAsyncThunk(
  'billing/updateBill',
  async ({ id, billData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/bills/${id}`, billData);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update bill';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

export const deleteBill = createAsyncThunk(
  'billing/deleteBill',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/bills/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete bill');
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    items: [],
    selectedBill: null,
    loading: false,
    actionLoading: false,
    error: null
  },
  reducers: {
    clearBillingError: (state) => {
      state.error = null;
    },
    clearSelectedBill: (state) => {
      state.selectedBill = null;
    },
    updateBillStatusLocally: (state, action) => {
      const { billId, status } = action.payload;
      const bill = state.items.find((b) => b.id === billId);
      if (bill) {
        bill.paymentStatus = status;
      }
      if (state.selectedBill?.id === billId) {
        state.selectedBill.paymentStatus = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBillById.fulfilled, (state, action) => {
        state.selectedBill = action.payload;
      })
      .addCase(createBill.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBill.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedBill?.id === action.payload.id) {
          state.selectedBill = action.payload;
        }
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBill.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter((b) => b.id !== action.payload);
        if (state.selectedBill?.id === action.payload) {
          state.selectedBill = null;
        }
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearBillingError, clearSelectedBill, updateBillStatusLocally } = billingSlice.actions;
export default billingSlice.reducer;
