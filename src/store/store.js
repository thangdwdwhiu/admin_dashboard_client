import { configureStore } from "@reduxjs/toolkit"
import authSlice from '../features/authSlice'
import userSlice from "../features/userSlice"
import statsSlice from "../features/statsSlice"
import userListSlice from "../features/userListSlice"
import devicesSlice from "../features/devicesSlice"

const store = configureStore({
    reducer : {
        auth : authSlice,
        user: userSlice,
        stats: statsSlice,
        users: userListSlice,
        devices: devicesSlice
    }
})

export default store