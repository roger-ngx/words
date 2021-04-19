import { createSlice } from "@reduxjs/toolkit";
import { set, get } from 'lodash';

export const filesSlice = createSlice({
    name: 'files',
    initialState: {
        projects: {},
        selectedType: '',
        selectedFileName: '',
        selectedProject: 'default'
    },
    reducers: {
        setFiles: (state, action) => {
            const { project, files } = action.payload;
            const obj = set({}, `${project}`, files);
            state.projects = {...state.projects, ...obj};

        },
        addFile: (state, action) => {
            const { project, file } = action.payload;

            const files = get(state.projects, `${project}`, []);

            set(state.projects, `${project}`, [...files, file]);
        },
        setSelectedProject: (state, action) => {
            state.selectedProject = action.payload;
        },
        setSelectedFileName: (state, action) => {
            state.selectedFileName = action.payload;
        },
        setSelectedType: (state, action) => {
            state.selectedType = action.payload;
        }
    }
});

export const { setFiles, addFile, setSelectedProject, setSelectedFileName, setSelectedType } = filesSlice.actions;

export default filesSlice.reducer;