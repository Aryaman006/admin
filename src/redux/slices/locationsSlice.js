import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

// 🔹 Fetch all locations
export const fetchLocations = createAsyncThunk("locations/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest("/locations", "GET", null, token);
    return res.data; // API returns { success, data: [...] }
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Add location
export const addLocation = createAsyncThunk("locations/add", async (location, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest("/locations", "POST", location, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Edit location
export const editLocation = createAsyncThunk("locations/edit", async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest(`/locations/${id}`, "PUT", data, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Delete location
export const deleteLocation = createAsyncThunk("locations/delete", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    await apiRequest(`/locations/${id}`, "DELETE", null, token);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const locationsSlice = createSlice({
  name: "locations",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => { state.loading = true; })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addLocation.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(editLocation.fulfilled, (state, action) => {
        const idx = state.list.findIndex(l => l._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.list = state.list.filter(l => l._id !== action.payload);
      });
  }
});

export default locationsSlice.reducer;
