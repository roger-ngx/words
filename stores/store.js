import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './fileSlice';
import userReducer from './userSlice'

export default configureStore({
    reducer: {
        files: filesReducer,
        user: userReducer
    }
});