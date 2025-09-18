import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./slices/itemsSlice";
import locationsReducer from "./slices/locationsSlice";
import managersReducer from "./slices/managersSlice";
import tripsReducer from "./slices/tripsSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    locations: locationsReducer,
    managers: managersReducer,
    trips: tripsReducer,
    auth: authReducer,
  },
});

export default store;
