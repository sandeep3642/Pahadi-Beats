import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiHelper from '../utils/apiHelper'; // Adjust the path based on your project structure

// Async thunk to fetch profile data
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // Use apiHelper to make the API request
    const data = await apiHelper('/api/user/me', 'GET', null, headers);

    return data.data;  // Return the fetched data 
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;  // Reset error on new fetch
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Use payload from rejectWithValue
      });
  },
});

export default profileSlice.reducer;
