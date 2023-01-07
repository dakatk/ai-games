// Basic React stuff
import React from 'react';

// MUI components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ClearIcon from '@mui/icons-material/Clear';

// Stylesheet
import './SettingsMenu.scss';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface SettingsMenuProps {
    open: boolean;
    onClose: () => void;
}

export default class SettingsMenu extends React.Component<SettingsMenuProps> {
    render() {
        return (
            <div>
                <Modal
                    open={this.props.open}
                    onClose={() => this.props.onClose()}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Text in a modal
                            <ClearIcon 
                                className="close-button" 
                                onClick={() => this.props.onClose()} 
                            />
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                    </Box>
                </Modal>
            </div>
        )
    }
}