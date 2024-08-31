import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiHelper from '../utils/apiHelper';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('sessionId='))
        ?.split('=')[1];

      if (!token || !sessionId) {
        throw new Error('Authentication credentials missing');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        sessionId: sessionId
      };

      const response = await apiHelper('/api/user/me', 'GET', null, headers);

      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to fetch profile');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;