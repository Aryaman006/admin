import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

// 🔹 Fetch all materials
export const fetchItems = createAsyncThunk("items/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest("/materials", "GET", null, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Add material
export const addItem = createAsyncThunk("items/add", async (item, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest("/materials", "POST", item, token);
    console.log(res);
    
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Edit material
export const editItem = createAsyncThunk("items/edit", async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    const res = await apiRequest(`/materials/${id}`, "PUT", data, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Delete material
export const deleteItem = createAsyncThunk("items/delete", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    await apiRequest(`/materials/${id}`, "DELETE", null, token);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const itemsSlice = createSlice({
  name: "items",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => { state.loading = true; })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItem.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(editItem.fulfilled, (state, action) => {
        const idx = state.list.findIndex(i => i._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.list = state.list.filter(i => i._id !== action.payload);
      });
  }
});

export default itemsSlice.reducer;
