import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@material-ui/core";
import { isEmpty } from 'lodash';

const AddNewClassDialog = ({open, setOpen, onAddNewClass}) => {
    const [ verified, setVerified ] = useState(false);
    const [ className, setClassName ] = useState('');

    const addNewClass = () => {
        setVerified(true);
        !isEmpty(className) && onAddNewClass(className);
    };

    const onClassNameChange = e => setClassName(e.target.value);

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
                Add a new class
            </DialogTitle>
            <DialogContent>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <TextField
                        label='class name'
                        required
                        helperText={verified && isEmpty(className) && 'required'}
                        onChange={onClassNameChange}
                        value={className}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => setOpen(false)}>Cancel</Button>
                <Button color='primary' variant='outlined' onClick={addNewClass}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddNewClassDialog;