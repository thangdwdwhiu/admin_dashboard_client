import { createSlice } from "@reduxjs/toolkit"
import { checkAuth } from "./authSlice"
// CREATE USER SLICE

const initialState = {
    user: null,
    loading: false,
    error: null
}

const reducers = {
    setUser: (state, action) => {
        state.user = action.payload.user
    }
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: reducers,
    extraReducers: (builder) => {
        builder
        // CHECK AUTH
        .addCase(checkAuth.pending, (state) => {
            state.loading = true
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload.user
            state.loading = false
            state.error = null
        })
        .addCase(checkAuth.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload.error
            state.user = null
        })
    }
})


export default userSlice.reducer
export const {setUser} = userSlice.actions
