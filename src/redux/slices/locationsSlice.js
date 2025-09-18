import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [
    { id: 1, name: "Delhi" },
    { id: 2, name: "Mumbai" },
    { id: 3, name: "Bangalore" },
  ],
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    addLocation: (state, action) => {
      state.locations.push({ id: Date.now(), name: action.payload });
    },
    editLocation: (state, action) => {
      const { id, name } = action.payload;
      const loc = state.locations.find(l => l.id === id);
      if (loc) loc.name = name;
    },
    deleteLocation: (state, action) => {
      state.locations = state.locations.filter(l => l.id !== action.payload);
    },
  },
});

export const { addLocation, editLocation, deleteLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
