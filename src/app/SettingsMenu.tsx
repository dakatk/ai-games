// Basic React stuff
import React from 'react';

// MUI components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';

// Other components
import ContextFormControls from './ContextFormControls';

// AI types
import AiType from './ai/AiType';

// App context
import { AppContextData } from './AppContext';

// String functions (util)
import { capitalize } from '../util/String';

// Stylesheet
import './SettingsMenu.scss';
import { Divider } from '@mui/material';

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
     * App context
     */
    appContext: AppContextData;
    /**
     * Callback to update the app context
     */
    updateAppContext: (context: AppContextData) => Promise<void>;
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

    // ====================== Event handlers =============================

    private async onReset() {
        // Update 'dirty' flag (doesn't matter if it's 'true' or 'false', 
        // as long as it's inverted from it's previous value)
        const dirty: boolean = !this.props.appContext.dirty;
        await this.props.updateAppContext({ ...this.props.appContext, dirty });

        // Close the settings modal
        this.props.onClose();
    }

    // ====================== Component rendering ========================

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
                            sx={{ mt: 4, alignItems: 'center' }}
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                        >
                            <Box>
                                <ContextFormControls
                                    context={this.props.appContext}
                                    updateContext={(context: AppContextData) => this.props.updateAppContext(context)}
                                />
                                
                                <Divider
                                    sx={{ mt: '1em', mb: '0.8em', w: '100%', ml: -5, mr: -5 }}
                                />

                                {this.renderButtons()}
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </div>
        )
    }

    /**
     * Renders 'Save', 'Load', and 'Reset' buttons
     */
    private renderButtons(): JSX.Element[] {
        return [
            <Button
                key={0}
                className='settings-button'
                onClick={() => this.props.onSave()}
            >
                Save
            </Button>,
            <Button
                key={1}
                className='settings-button'
                onClick={() => this.props.onLoad()}
            >
                Load
            </Button>,
            <Button
                key={2}
                className='settings-button'
                onClick={async () => await this.onReset()}
            >
                Reset
            </Button>
]
    }

    // ===================================================================
}