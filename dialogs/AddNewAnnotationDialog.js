import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@material-ui/core";
import { isEmpty } from 'lodash';

const AddNewAnnotationDialog = ({open, setOpen, onAddNewAnnotation}) => {
    const [ verified, setVerified ] = useState(false);
    const [ longName, setLongName ] = useState('');
    const [ shortName, setShortName ] = useState('');

    const addNewAnnotation = () => {
        setVerified(true);
        !isEmpty(longName) && !isEmpty(shortName) && onAddNewAnnotation({longName, shortName});
    };

    const onShortNameChange = e => setShortName(e.target.value);

    const onLongNameChange = e => setLongName(e.target.value);

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
                Add a new annotation
            </DialogTitle>
            <DialogContent>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <TextField
                        label='long name'
                        required
                        helperText={verified && isEmpty(longName) && 'required'}
                        onChange={onLongNameChange}
                        value={longName}
                    />
                    <TextField
                        label='short name'
                        required
                        helperText={verified && isEmpty(shortName) && 'required'}
                        onChange={onShortNameChange}
                        value={shortName}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => setOpen(false)}>Cancel</Button>
                <Button color='primary' variant='outlined' onClick={addNewAnnotation}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddNewAnnotationDialog;