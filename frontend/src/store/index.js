import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import patientReducer from './patientSlice';
import billingReducer from './billingSlice';
import paymentReducer from './paymentSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    billing: billingReducer,
    payment: paymentReducer,
    dashboard: dashboardReducer
  }
});
