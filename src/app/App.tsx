// Basic React stuff
import React from 'react';
import ReactRouter from 'react-router-dom';

// React router components
import { Link as RouterLink, Outlet } from 'react-router-dom';

// MUI components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

// Stylesheet
import './App.scss';

/** 
 * Data for menu nav items
 */
interface NavItem {
    /**
     * Display name for menu item
     */
    friendlyName: React.Key,
    /**
     * URL to navigate to upon clicking menu item
     */
    path: ReactRouter.To
}

/**
 * Main component that handles the global menu bar and 
 * renders the respective component for any given route
 */
export default class App extends React.Component {
    // Menu navigation items
    private static navItems: Array<NavItem> = [
        {
            friendlyName: 'Tic-Tac-Toe',
            path: '/tictactoe?ai=menace'
        },
        {
            friendlyName: 'Chess',
            path: '/chess'
        }
    ];

    render() {
        return (
            <Box className='parent'>
                <Box className='menu'>
                    <AppBar component='nav'>
                        <Toolbar>
                            <Typography
                                to='/'
                                component={RouterLink}
                                className='anchor'
                                sx={{ mr: '1.5em', display: { xs: 'none', sm: 'block' } }}
                            > Games
                            </Typography>

                            <Divider orientation='vertical' flexItem sx={{ mr: '0.5em' }}/>

                            {App.navItems.map((item: NavItem) => (
                                <MenuItem
                                    to={item.path}
                                    key={item.friendlyName}
                                    sx={{ ml: '0.5em' }}
                                    component={RouterLink}
                                >
                                    <Typography textAlign='center'>{item.friendlyName}</Typography>
                                </MenuItem>
                            ))}

                            <Divider orientation='vertical' flexItem sx={{ mt: 0, mb: 0, mr: '0.5em', ml: '1em' }}/>
                        </Toolbar>
                    </AppBar>
                </Box>

                <Box className='component'>
                    <Outlet />
                </Box>
            </Box>
        );
    }
}
