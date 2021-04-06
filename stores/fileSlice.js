import { createSlice } from "@reduxjs/toolkit";

export const filesSlice = createSlice({
    name: 'files',
    initialState: {
        annotation: [],
        classification: []
    },
    reducers: {
        setFiles: (state, action) => {
            const { type, files } = action.payload;
            switch(type){
                case 'annotation':
                    state.annotation = files;
                    break;
                case 'classification':
                    state.classification = files;
                    break;
            }
        }
    }
});

export const { setFiles } = filesSlice.actions;

export default filesSlice.reducer;