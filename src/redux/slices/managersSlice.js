import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  managers: [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Michael Johnson" },
  ],
};

const managersSlice = createSlice({
  name: "managers",
  initialState,
  reducers: {
    addManager: (state, action) => {
      state.managers.push({ id: Date.now(), name: action.payload });
    },
    editManager: (state, action) => {
      const { id, name } = action.payload;
      const manager = state.managers.find(m => m.id === id);
      if (manager) manager.name = name;
    },
    deleteManager: (state, action) => {
      state.managers = state.managers.filter(m => m.id !== action.payload);
    },
  },
});

export const { addManager, editManager, deleteManager } = managersSlice.actions;
export default managersSlice.reducer;
