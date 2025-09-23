import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

// 🔹 Fetch all drivers
export const fetchManagers = createAsyncThunk("managers/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest("/drivers", "GET", null, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Add driver
export const addManager = createAsyncThunk("managers/add", async (manager, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest("/drivers", "POST", manager, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Edit driver
export const editManager = createAsyncThunk("managers/edit", async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest(`/drivers/${id}`, "PUT", data, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Delete driver
export const deleteManager = createAsyncThunk("managers/delete", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    await apiRequest(`/drivers/${id}`, "DELETE", null, token);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const managersSlice = createSlice({
  name: "managers",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagers.pending, (state) => { state.loading = true; })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addManager.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(editManager.fulfilled, (state, action) => {
        const idx = state.list.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m._id !== action.payload);
      });
  }
});

export default managersSlice.reducer;
