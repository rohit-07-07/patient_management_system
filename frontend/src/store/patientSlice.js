import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async ({ search, gender } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (search) params.search = search;
      if (gender && gender !== 'All') params.gender = gender;
      const response = await axiosClient.get('/patients', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'patients/fetchPatientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/patients/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch patient details');
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/patients', patientData);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add patient';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/patients/${id}`, patientData);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update patient';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/patients/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete patient');
    }
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    items: [],
    selectedPatient: null,
    loading: false,
    actionLoading: false,
    error: null,
    searchTerm: '',
    selectedGender: 'All'
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedGender: (state, action) => {
      state.selectedGender = action.payload;
    },
    clearPatientError: (state) => {
      state.error = null;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.selectedPatient = action.payload;
      })
      .addCase(createPatient.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePatient.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePatient.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
        if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null;
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setSearchTerm, setSelectedGender, clearPatientError, clearSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer;
