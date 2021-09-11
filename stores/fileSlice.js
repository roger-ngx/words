import { createSlice } from "@reduxjs/toolkit";
import { set, get, forEach } from 'lodash';

export const filesSlice = createSlice({
    name: 'files',
    initialState: {
        projects: {},
        selectedType: null,
        selectedFileName: null,
        selectedProject: null
    },
    reducers: {
        setProjects:  (state, action) => {
            const { names } = action.payload;
            const projects = {};
            forEach(names, name => set(projects, `${name}`, []));
            state.projects = {...projects, ...state.projects};
        },
        addProject:  (state, action) => {
            const { name } = action.payload;
            const obj = set({}, `${name}`, []);
            state.projects = {...state.projects, ...obj};
        },
        setFiles: (state, action) => {
            const { project, files } = action.payload;
            const obj = set({}, `${project}`, [...files]);
            console.log('setFiles', obj);
            state.projects = {...state.projects, ...obj};
            console.log('setFiles', state.projects);
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

export const { setFiles, addFile, setSelectedProject, setSelectedFileName, setSelectedType, setProjects, addProject } = filesSlice.actions;

export default filesSlice.reducer;