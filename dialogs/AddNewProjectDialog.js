import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@material-ui/core";
import { isEmpty } from 'lodash';

const AddNewProjectDialog = ({open, setOpen, onFinish}) => {
    const [ verified, setVerified ] = useState(false);
    const [ projectName, setProjectName ] = useState('');

    const addNewProject = () => {
        setVerified(true);
        !isEmpty(projectName) && onFinish(projectName);
    };

    const onProjectNameChange = e => setProjectName(e.target.value);

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
                Add a new project
            </DialogTitle>
            <DialogContent>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <TextField
                        label='project name'
                        required
                        helperText={verified && isEmpty(projectName) && 'required'}
                        onChange={onProjectNameChange}
                        value={projectName}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => setOpen(false)}>Cancel</Button>
                <Button color='primary' variant='outlined' onClick={addNewProject}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddNewProjectDialog;