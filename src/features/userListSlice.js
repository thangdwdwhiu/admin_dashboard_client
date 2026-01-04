import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiFetch from "../services/api/apiFetch"

const baseUrl = import.meta.env.VITE_API_URL

/* ================= FETCH USERS ================= */
export const fetchUsers = createAsyncThunk(
  "users/list",
  async (_, thunkAPI) => {
    try {
      const res = await apiFetch(`${baseUrl}/api/users`, {
        method: "GET"
      })
      const data = await res.json()

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data)
      }

      return data
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: "Lỗi mạng" })
    }
  }
)

/* ================= DELETE USER ================= */
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      const res = await apiFetch(`${baseUrl}/api/users/${id}`, {
        method: "DELETE"
      })

      const data = await res.json()

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data)
      }

      return data
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: "Lỗi mạng" })
    }
  }
)

/* ================= ADD USER ================= */
export const addOneUser = createAsyncThunk(
  "users/add",
  async (payload, thunkAPI) => {
    try {
      const res = await apiFetch(`${baseUrl}/api/users`, {
        method: "POST",
        body: payload
      })

      const data = await res.json()

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data)
      }

      return data
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: "Lỗi mạng" })
    }
  }
)

/* ================= UPDATE USER (PATCH) ================= */
export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, payload }, thunkAPI) => {
    try {
      const res = await apiFetch(`${baseUrl}/api/users/${id}`, {
        method: "PATCH",
        body: payload
      })

      const data = await res.json()

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error)
      }

      return data
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: "Lỗi mạng" })
    }
  }
)

/* ================= STATE ================= */
const initialState = {
  list: [],
  loading: false,
  error: null,
  filters: {
    role: "all",
    keyword: ""
  }
}

/* ================= SLICE ================= */
const userListSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setList: (state, action) => {
      state.list = action.payload
    },
    filterAdmin: (state) => {
      state.list = state.list.filter(user => user.role_name === "ADMIN")
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      /* ===== FETCH ===== */
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.list
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || "Lỗi server"
        state.list = []
      })

      /* ===== DELETE ===== */
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        const deletedId = String(action.payload?.id ?? action.payload)
        state.list = state.list.filter(
          (user) => String(user.id) !== deletedId
        )
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || "Lỗi server"
      })

      /* ===== ADD ===== */
      .addCase(addOneUser.pending, (state) => {
        state.loading = true
      })
      .addCase(addOneUser.fulfilled, (state, action) => {
        state.loading = false
        state.list.unshift(action.payload.user)
      })
      .addCase(addOneUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || "Lỗi server"
      })

      /* ===== UPDATE (PATCH) ===== */
      .addCase(updateUser.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false

        const updatedUser = action.payload.user || action.payload

        const index = state.list.findIndex(
          user => user.id === updatedUser.id
        )

        if (index !== -1) {
          state.list[index] = {
            ...state.list[index],
            ...updatedUser
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || "Lỗi server"
      })
  }
})

/* ================= EXPORT ================= */
export default userListSlice.reducer
export const {
  setList,
  filterAdmin,
  setFilters
} = userListSlice.actions
