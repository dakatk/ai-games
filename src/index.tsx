// Basic React stuff
import React from 'react';
import ReactDOM from 'react-dom/client';

// MUI themes
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
    Theme
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// App routing
import Routing from './Routing';

// Stylesheet
import './index.scss';

// Create root element from DOM
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// Use MUI dark theme as global theme
const darkTheme: Theme = createTheme({
    palette: {
        mode: 'dark',
    }
});

root.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
                <Routing />
            </StyledEngineProvider>
        </ThemeProvider>
    </React.StrictMode>
);
