// Basic React stuff
import React from 'react';

// MUI components
import Box from '@mui/material/Box';

// Stylesheet
import './About.scss';

/**
 * About/Welcome page
 */
export default class About extends React.Component {
    render() {
        return (
            <Box className='welcome-text'>
                Check out the various AIs I've developed by playing against them in a number of different games
            </Box>
        );
    }
}