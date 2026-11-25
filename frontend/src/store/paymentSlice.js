import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';

export const createRazorpayOrder = createAsyncThunk(
  'payment/createRazorpayOrder',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/payments/create-order', { billId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to initiate Razorpay order');
    }
  }
);

export const verifyRazorpayPayment = createAsyncThunk(
  'payment/verifyRazorpayPayment',
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/payments/verify', verificationData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Payment verification failed');
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'payment/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/payments/history');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load payment history');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    orderData: null,
    loading: false,
    verifying: false,
    paymentStatus: 'idle',
    lastPaymentResult: null,
    history: [],
    historyLoading: false,
    error: null
  },
  reducers: {
    clearPaymentState: (state) => {
      state.orderData = null;
      state.loading = false;
      state.verifying = false;
      state.paymentStatus = 'idle';
      state.lastPaymentResult = null;
      state.error = null;
    },
    setPaymentFailed: (state, action) => {
      state.paymentStatus = 'failed';
      state.error = action.payload || 'Payment transaction failed or was cancelled';
      state.loading = false;
      state.verifying = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = 'creating_order';
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        state.paymentStatus = 'order_created';
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.verifying = true;
        state.error = null;
        state.paymentStatus = 'verifying';
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.verifying = false;
        state.paymentStatus = 'success';
        state.lastPaymentResult = action.payload;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPaymentState, setPaymentFailed } = paymentSlice.actions;
export default paymentSlice.reducer;
