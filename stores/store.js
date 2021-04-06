import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './fileSlice';

export default configureStore({
    reducer: {
        files: filesReducer
    }
});