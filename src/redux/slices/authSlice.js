import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://rice-mill-tracker-production.up.railway.app/v1";

// 🔐 Register thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Store user + access token
      const userWithToken = {
        ...data.user,
        token: data.tokens.access.token,
      };
      localStorage.setItem("authUser", JSON.stringify(userWithToken));

      return userWithToken;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔐 Login thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      // Store user + access token
      const userWithToken = {
        ...data.user,
        token: data.tokens.access.token,
      };
      localStorage.setItem("authUser", JSON.stringify(userWithToken));

      return userWithToken;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔐 Logout thunk (local only)
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("authUser");
  return null;
});

// 🔐 Refresh thunk
export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue }) => {
    try {
      const stored = localStorage.getItem("authUser");
      if (!stored) return rejectWithValue("No user stored");

      const user = JSON.parse(stored);

      // Use refresh token if needed or access token
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Session expired");

      // Update stored user + token
      const userWithToken = {
        ...data.user,
        token: data.tokens.access.token,
      };
      localStorage.setItem("authUser", JSON.stringify(userWithToken));

      return userWithToken;
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
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
