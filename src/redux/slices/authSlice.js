import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔐 Login thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // 👉 Replace this with real backend API
      if (email === "admin@test.com" && password === "123456") {
        const user = { id: 1, name: "Admin User", email, token: "fake-jwt-token" };

        // store token in localStorage (for refresh)
        localStorage.setItem("authUser", JSON.stringify(user));
        document.cookie = `user=${user.email}; path=/`; // for middleware

        return user;
      } else {
        return rejectWithValue("Invalid credentials");
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔐 Logout thunk
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("authUser");
  document.cookie = "user=; path=/; max-age=0"; // clear cookie
  return null;
});

// 🔐 Refresh thunk (on app load)
export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue }) => {
    try {
      const stored = localStorage.getItem("authUser");
      if (!stored) return rejectWithValue("No user stored");

      const user = JSON.parse(stored);

      // 👉 OPTIONAL: if you have backend, validate token
      // const res = await fetch("/api/refresh", { headers: { Authorization: `Bearer ${user.token}` }});
      // const newToken = await res.json();
      // user.token = newToken;

      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // Refresh
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
