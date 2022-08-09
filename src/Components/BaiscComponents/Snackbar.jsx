import React from 'react'
import SnackbarMUI from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const Snackbar = (props) => {
    return (
        <SnackbarMUI
            open={props.open}
            autoHideDuration={props.autoHideDuration}
            onClose={props.onClose}
        >
            <Alert severity={props.type}>
                {props.message}
            </Alert>
        </SnackbarMUI>
    )
}

export default Snackbar;