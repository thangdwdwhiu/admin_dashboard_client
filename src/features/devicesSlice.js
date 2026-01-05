import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiFetch from "../services/api/apiFetch";

const baseUrl = import.meta.env.VITE_API_URL

// FETCH DEVICES
const getDevices = createAsyncThunk ("devices/get", async (_, thunk) => {
    const res = await apiFetch(`${baseUrl}/api/devices`, {
        method: "GET",
        credential: "include"
    })
    const data = await res.json()
    if (!res.ok) {
        return thunk.rejectWithValue({error: data.error})
    }
    return data
})
// REVOKE 1 thiết bị
const revokeOneDevice = createAsyncThunk("devices/revoke/:id", async (device_id, thunk) => {
    const res =  await apiFetch(`${baseUrl}/api/devices/revoke/${device_id}`,{
        method: "PATCH",
        credential: "include"
    })
    const data= await res.json()
    if (!res.ok) {
        return thunk.rejectWithValue({error: data.error})
    }
    return data
})
// REVOKE OTHER
const revokeOther = createAsyncThunk("devices/revoke-other", async (device_id, thunk) => {
    const res = await apiFetch(`${baseUrl}/api/devices/revoke-other/${device_id}`,{
        method: "PUT",
        credential: "include"
    })
    const data  =await res.json()
    if (!res.ok) {
        return thunk.rejectWithValue({error: data.error || "loi server"})
    }
    return data
})

const initialState = {
    devices : {
        list: [],
        loading: false,
        error: null
    },
    revokeOne: {
        loading: false,
        error: null,
        message: ""
    },
    revokeOther: {
        loading: false,
        error: ""
    }

}
const devicesSlice = createSlice({
    name : "devices",
    initialState,
    reducers : {

    },
    extraReducers: (builder) => {
        builder
        // fecth devices
        .addCase(getDevices.pending, (state) => {
            state.devices.loading = true
        })
        .addCase(getDevices.fulfilled, (state, action) => {
            state.devices.list = action.payload.devices
            state.devices.loading = false
            state.devices.error = null
        })
        .addCase(getDevices.rejected, (state, action) => {
            state.devices.list = []
            state.devices.loading = false
            state.devices.error = action.payload.error || "Lỗi server"
        })
        //Revoke one device
        .addCase(revokeOneDevice.pending, (state) => {
            state.revokeOne.loading = true
        })
        .addCase(revokeOneDevice.fulfilled, (state, action) => {
            state.revokeOne.loading = false
            state.revokeOne.error = null
            state.revokeOne.message = action.payload.message
            state.devices.list = state.devices.list.filter((i) => {
  return i.device_id !== action.payload.device_id
})

      
        })
        .addCase(revokeOneDevice.rejected, (state, action) => {
            state.revokeOne.error = action.payload.error || "Loi server"
            state.revokeOne.loading = false
        })
        //REVOKE OTHER
        .addCase(revokeOther.pending, (state) => {
            state.revokeOther.loading = true
        })
        .addCase(revokeOther.fulfilled, (state,action) => {
            state.revokeOther.loading = false
                        state.devices.list = state.devices.list.filter((i) => {
  return i.device_id === action.payload.device_id
})
        })
        .addCase(revokeOther.rejected, (state) => {
            state.revokeOther.loading =false
        })

    }
})

export {getDevices, revokeOneDevice, revokeOther}
export default devicesSlice.reducer