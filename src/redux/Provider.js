"use client";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { refreshUser } from "./slices/authSlice";
// import { refreshUser } from "./authSlice";

function Init({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);
  return children;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <Init>{children}</Init>
    </Provider>
  );
}
