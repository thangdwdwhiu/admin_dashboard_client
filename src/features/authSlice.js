import { createAsyncThunk } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { setAccessToken as setAuthTokenLocal, clearAccessToken as clearAuthTokenLocal } from "../services/authTokens"
import { Navigate } from "react-router-dom"

const baseUrl = import.meta.env.VITE_API_URL

// GIA TRI KHOI TAO ===============================================
const initialState = {
    isAuth: false,
    accessToken: null,
    loading: true,
    error: null
}

// REDUCERS

const reducers = {
    resetAuthError : (state) =>{
        state.error = null
    }
}

// Thêm reducer để cập nhật accessToken từ nơi khác (ví dụ sau khi refresh)
reducers.setAccessToken = (state, action) => {
    state.accessToken = action.payload || null
    state.isAuth = !!action.payload
}

// LOGIN ===============================================================


const login = createAsyncThunk('auth/login', async (payload, thunk) => {
    try {
            const res = await fetch(`${baseUrl}/api/auth/login`,{
                method: "POST",
                credentials: 'include',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok)
            {
                return thunk.rejectWithValue(data)
            }
            return data
    }
    catch (err) {
        console.log(err.message)
        return thunk.rejectWithValue({error: "Lỗi mạng"})
    }
})
// API XÁC THỰC NGƯỜI DÙNG 
const checkAuth = createAsyncThunk("auth/me", async ( _, thunk) =>{
    try{
        const res = await fetch(`${baseUrl}/api/auth/me`,{
            method: "GET",
            credentials: 'include',
            headers: {"Content-Type" : "application/json"}

        })
        const data = await res.json()

        if (res.status === 401) {
            return thunk.rejectWithValue(data) 
        }
        return data
    }
    catch (err) {
        console.log(err)
        return thunk.rejectWithValue({error: "Lỗi mạng"})
    }
})



// TAO AUTH SLICE
const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: reducers,
    extraReducers: (builder) => {
        builder
        //LOGIN
        .addCase(login.pending, (state) => {
            state.loading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken
            state.isAuth = true
            state.loading = false
            // Lưu token vào authTokens module để apiFetch sử dụng (tránh circular import)
            try { setAuthTokenLocal(action.payload.accessToken) } catch(e){}
        })
        .addCase(login.rejected, (state, action) =>{
            state.loading = false
            state.error = action.payload.error || "Lỗi server"
        })
        //CHECK AUTH
        .addCase(checkAuth.pending, (state) =>{
            state.loading = true
        })
        .addCase(checkAuth.fulfilled, (state, action) =>{
            state.accessToken = action.payload.accessToken
            state.error = null
            state.isAuth = true
            state.loading = false
            try { setAuthTokenLocal(action.payload.accessToken) } catch(e){}

        })
        .addCase(checkAuth.rejected, (state, action) => {
            state.accessToken = null
            state.isAuth = false
            state.error = action.payload.error || "Phiên đăng nhập hết hạn"
            state.loading = false
            try { clearAuthTokenLocal() } catch(e){}
        })
    }
})


export {login, checkAuth}
export default authSlice.reducer
export const {resetAuthError, setAccessToken} = authSlice.actions