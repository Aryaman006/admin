import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trips: [
    {
      id: 1,
      origin: "Delhi",
      destination: "Mumbai",
      items: "Wheat",
      weight: "20kg",
      manager: "John Doe",
    },
    {
      id: 2,
      origin: "Bangalore",
      destination: "Hyderabad",
      items: "Rice",
      weight: "15kg",
      manager: "Jane Smith",
    },
  ],
};

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    addTrip: (state, action) => {
      state.trips.push({ id: Date.now(), ...action.payload });
    },
    editTrip: (state, action) => {
      const { id, updatedTrip } = action.payload;
      const trip = state.trips.find(t => t.id === id);
      if (trip) Object.assign(trip, updatedTrip);
    },
    deleteTrip: (state, action) => {
      state.trips = state.trips.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTrip, editTrip, deleteTrip } = tripsSlice.actions;
export default tripsSlice.reducer;
