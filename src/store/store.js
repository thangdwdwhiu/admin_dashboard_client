import { configureStore } from "@reduxjs/toolkit"
import authSlice from '../features/authSlice'
import userSlice from "../features/userSlice"
import statsSlice from "../features/statsSlice"
const store = configureStore({
    reducer : {
        auth : authSlice,
        user: userSlice,
        stats: statsSlice
    }
})

export default store