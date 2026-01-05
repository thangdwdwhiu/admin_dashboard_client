import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkAuth, login } from "./authSlice";
import apiFetch from "../services/api/apiFetch";

const baseUrl = import.meta.env.VITE_API_URL;

// CREATE USER SLICE

const initialState = {
  user: null,
  loading: false,
  error: null,
  profile: {
    profile: {},
    loading: false,
    error: null,
    update: {
      loading: false,
      error: null,
    },
  },
};

//GET PROFILE
const getProfile = createAsyncThunk("user/profile", async (_, thunk) => {
  try {
    const res = await apiFetch(`${baseUrl}/api/users/profile`, {
      method: "GET",
      credential: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      return thunk.rejectWithValue(data.error);
    }
    return data;
  } catch (err) {
    console.log(err);
    return thunk.rejectWithValue("Lỗi mạng");
  }
});

// UPDATE PROFILE

const UpdateProfile = createAsyncThunk(
  "user/update",
  async (formData, thunk) => {
    try {
      const res = await apiFetch(`${baseUrl}/api/users/profile`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        return thunk.rejectWithValue(data.error);
      }
      return data;
    } catch (err) {
      console.log(err);
      return thunk.rejectWithValue("Lỗi mạng");
    }
  }
);
const reducers = {
  setUser: (state, action) => {
    state.user = action.payload.user;
  },
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: reducers,
  extraReducers: (builder) => {
    builder
      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
        state.user = null;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload?.error || "Đăng nhập thất bại";
      })

      // PROFILE
      .addCase(getProfile.pending, (state) => {
        state.profile.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile.profile = action.payload.profile;
        state.profile.loading = false;
        state.profile.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profile.error = action.payload || action.payload?.error;
        state.profile.loading = false;
      })

      // UPDATE PROFILE
      .addCase(UpdateProfile.pending, (state) => {
        state.profile.update.loading = true;
      })
      .addCase(UpdateProfile.fulfilled, (state, action) => {
        state.profile.profile = action.payload.profile;
        state.profile.update.loading = false;
        state.profile.update.error = null;
      })
      .addCase(UpdateProfile.rejected, (state, action) => {
        state.profile.update.loading = false;
        state.profile.update.error = action.payload?.error;
      });
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
export { getProfile, UpdateProfile };
