import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiFetch from "../services/api/apiFetch";


const baseUrl = import.meta.env.VITE_API_URL

// GIA TRI KHOI TAO
const initialState = {
    stats : { summary: { total: 0, active: 0, blocked: 0 }, chart: [] },
    loading: false,
    error: null
}
//reducer

const reducers = {
    setStats: (state, action) => {
        state.stats = action.payload
    }
}
// GET STATS API
const getStats = createAsyncThunk("stats/getAll", async(_, thunk) => {
    try{
        const res = await apiFetch(`${baseUrl}/api/report/stats`,{
            method : "GET",
        })
        const data = await res.json()

        if (!res.ok)
        {
            return thunk.rejectWithValue({error: data})
        }
        return data
        
    }
    catch (err) {
        console.log(err);
        return thunk.rejectWithValue({error: "Lỗi mạng"})
    }
})
const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers,
    extraReducers : (builder) => {
        builder 
        // GET STATS
        .addCase(getStats.pending, (state) => {
            state.loading = true
        })
        .addCase(getStats.fulfilled, (state, action) => {
            state.error = null
            state.loading = false,
            state.stats = action.payload.data
        }) 
        .addCase(getStats.rejected, (state, action) => {
            state.error = action.payload || action.payload.error || "LỖI SERVER"
        })
    }
})

export {getStats}
export default statsSlice.reducer
export const {setStats} = statsSlice.actions