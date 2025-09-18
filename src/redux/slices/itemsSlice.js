import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    { id: 1, name: "Paddy" },
    { id: 2, name: "Wheat" },
    { id: 3, name: "Maize" },
    { id: 4, name: "Barley" },
    { id: 5, name: "Rice" },
    { id: 6, name: "Soybean" },
    { id: 7, name: "Millet" },
    { id: 8, name: "Oats" },
    { id: 9, name: "Sorghum" },
    { id: 10, name: "Rye" },
  ],
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push({
        id: state.items.length + 1,
        name: action.payload,
      });
    },
    editItem: (state, action) => {
      const { id, name } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.name = name;
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { addItem, editItem, deleteItem } = itemsSlice.actions;
export default itemsSlice.reducer;
