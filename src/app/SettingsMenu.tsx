// Basic React stuff
import React from 'react';

// MUI components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';

// AI types
import AiType from './ai/AiType';

// String functions (util)
import { capitalize } from '../util/String';

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

/**
 * Settings menu component props
 */
interface SettingsMenuProps {
    /**
     * Modal open flag
     */
    open: boolean;
    /**
     * AI type selected from context menu
     */
    aiType: AiType;
    /**
     * Modal `onClose` event handler
     */
    onClose: () => void;
    /**
     * Save button `onClick` handler
     */
    onSave: () => void;
    /**
     * Load button `onClick` handler
     */
    onLoad: () => void;
}

/**
 * Settings menu component
 */
export default class SettingsMenu extends React.Component<SettingsMenuProps> {
    render() {
        return (
            <div>
                <Modal
                    open={this.props.open}
                    onClose={() => this.props.onClose()}
                    aria-labelledby='modal-title'
                    aria-describedby='modal-description'
                >
                    <Box sx={style}>
                        <Typography id='modal-title' variant='h6' component='h2'>
                            Settings ({capitalize(this.props.aiType)})
                            <ClearIcon 
                                className='close-button' 
                                onClick={() => this.props.onClose()} 
                            />
                        </Typography>
                        <Box 
                            id='modal-description' 
                            sx={{ mt: 2, alignItems: 'center' }}
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                        >
                            <Button 
                                className='settings-button'
                                onClick={() => this.props.onSave()}
                            >
                                Save
                            </Button>
                            <Button 
                                className='settings-button'
                                onClick={() => this.props.onLoad()}
                            >
                                Load
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </div>
        )
    }
}