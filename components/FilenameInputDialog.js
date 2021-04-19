import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@material-ui/core';
import { isEmpty } from 'lodash';

const FilenameInputDialog = ({open, setOpen, onFinish}) => {
    const [ fileName, setFileName ] = useState('');

    const onFileNameChange = e => setFileName(e.target.value);

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
                Add a new file
            </DialogTitle>
            <DialogContent>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <TextField
                        label='file name'
                        required
                        onChange={onFileNameChange}
                        value={fileName}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                    disabled={isEmpty(fileName)}
                    color='primary'
                    variant='outlined'
                    onClick={() => onFinish(fileName + '.tsv')}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilenameInputDialog;