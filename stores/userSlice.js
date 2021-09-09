import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: {}
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.userInfo = action.payload
        }
    }
})

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;