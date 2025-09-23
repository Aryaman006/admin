import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

// 🔹 Fetch all trips
export const fetchTrips = createAsyncThunk("trips/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const data = await apiRequest("/trips", "GET", null, token);
    console.log(token);
    
    console.log(data);
    
    return data.data; // API returns { success, data: [...] }
  } catch (err) {
    return rejectWithValue(err.message);
    console.log(err);
    
  }
});

// 🔹 Add trip
export const addTrip = createAsyncThunk("trips/addTrip", async (trip, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const data = await apiRequest("/trips", "POST", trip, token);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Edit trip
export const editTrip = createAsyncThunk("trips/editTrip", async ({ id, updatedTrip }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const data = await apiRequest(`/trips/${id}`, "PUT", updatedTrip, token);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Delete trip
export const deleteTrip = createAsyncThunk("trips/deleteTrip", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    await apiRequest(`/trips/${id}`, "DELETE", null, token);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    trips: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
      })
      // Edit
      .addCase(editTrip.fulfilled, (state, action) => {
        const idx = state.trips.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.trips[idx] = action.payload;
      })
      // Delete
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter((t) => t._id !== action.payload);
      });
  },
});

export default tripsSlice.reducer;
