import { createSlice } from "@reduxjs/toolkit";

export const filesSlice = createSlice({
    name: 'files',
    initialState: {
        annotation: [],
        classification: [],
        selectedType: 'annotaion',
        selectedFileName: ''
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
        },
        addFile: (state, action) => {
            const { type, file } = action.payload;

            switch(type){
                case 'annotation':
                    state.annotation.push(file);
                    break;
                case 'classification':
                    state.classification.push(file);
                    break;
            }
        },
        setSelectedType: (state, action) => {
            state.selectedType = action.payload;
        },
        setSelectedFileName: (state, action) => {
            state.selectedFileName = action.payload;
        }
    }
});

export const { setFiles, addFile, setSelectedType, setSelectedFileName } = filesSlice.actions;

export default filesSlice.reducer;