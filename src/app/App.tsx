// Basic React stuff
import React from 'react';

// Async component base class
import AsyncComponent from './AsyncComponent';

// React router components
import { Link as RouterLink, Outlet } from 'react-router-dom';

// MUI components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';

// App context
import { AppContext } from './AppContext';

// AI stuff
import AiType from './ai/AiType';

// Custom string functions (util)
import { capitalize } from '../util/String';

// Stylesheet
import './App.scss'

/** 
 * Data for menu nav items
 */
interface NavItem {
    /**
     * Display name for menu item
     */
    friendlyName: string,
    /**
     * URL to navigate to upon clicking menu item
     */
    path: string
}

/**
 * App component state
 */
interface AppState {
    /**
     * Selected AI
     */
    ai?: AiType;
    /**
     * Name of selected tab
     */
    tab?: string;
}

/**
 * Main component that handles the global menu bar and 
 * renders the respective component for any given route
 */
export default class App extends AsyncComponent<any, AppState> {
    // Menu navigation items
    private static navItems: Array<NavItem> = [
        {
            friendlyName: 'Tic-Tac-Toe',
            path: '/tictactoe'
        },
        {
            friendlyName: 'Chess',
            path: '/chess'
        }
    ];

    // Form control rendering callbacks for each individual AI type
    private aiFormControls: Record<AiType, () => JSX.Element> = {
        [AiType.NEGAMAX]: () => <></>,
        [AiType.MENACE]: () => <></>,
    };

    // ====================== Initialization =============================

    constructor(props: any) {
        super(props);

        const path: string = props.router.location.pathname;
        const tab: NavItem | undefined = App.navItems.find((navItem: NavItem) => navItem.path === path);
        const tabName: string = tab?.friendlyName || '';

        this.state = {
            ai: AiType.NEGAMAX,
            tab: tabName
        };
    }

    // ====================== Event handlers =============================

    /**
     * Update selected tab name in component state
     */
    private async handleTabChange(tab: string) {
        await this.setStateAsync({ tab });
    }

    /**
     * Event handler for AI selection change
     */
    private async handleAiSelect(event: SelectChangeEvent): Promise<void> {
        // Attempt to parse AI name from selected value
        let aiName: string = event?.target?.value?.toUpperCase() || AiType.NEGAMAX;

        // If parsed name isn't in the `AiType` enum, 
        // default to using the Negamax AI
        if (!(aiName in AiType)) {
            aiName = AiType.NEGAMAX;
        }

        // Convert string to enum
        const aiType: AiType = AiType[aiName as keyof typeof AiType];

        await this.setStateAsync({ ai: aiType });
    }

    // ====================== React callback overrides ===================

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error);
        console.log(errorInfo);
    }

    // ====================== Component rendering ========================

    render() {
        return (
            <Box className='parent'>
                <Box className='menu'>
                    <AppBar component='nav'>
                        <Toolbar>
                            {this.renderAnchor()}

                            <Divider 
                                flexItem
                                className='divider'
                                orientation='vertical'
                                sx={{ mr: '0.5em' }} 
                            />

                            {this.renderNavItems()}

                            <Divider
                                flexItem
                                className='divider'
                                orientation='vertical' 
                                sx={{ mr: '1.5em', ml: '1em' }}
                            />

                            {this.renderFormControls()}
                        </Toolbar>
                    </AppBar>
                </Box>

                <Box className='component'>
                    <AppContext.Provider value={{ aiType: this.state.ai as AiType}}>
                        <Outlet />
                    </AppContext.Provider>
                </Box>
            </Box>
        );
    }

    /**
     * Menu anchor (home button)
     */
    private renderAnchor(): JSX.Element {
        return (
            <Typography
                to='/'
                component={RouterLink}
                className='anchor'
                sx={{ mr: '1.5em', display: { xs: 'none', sm: 'block' } }}
            >
                Home
            </Typography>
        );
    }

    /**
     * Menu nav items
     */
    private renderNavItems(): JSX.Element {
        return (
            <Tabs 
                value={this.state.tab}
                onChange={async (_: React.SyntheticEvent, newValue: string) => await this.handleTabChange(newValue)}
                aria-label='menu nav items'
            >
                <Tab value='' label='' className='empty-tab' disabled component='div' />
                {App.navItems.map((item: NavItem) => (
                    <Tab
                        to={item.path}
                        key={item.friendlyName}
                        component={RouterLink}
                        value={item.friendlyName}
                        label={item.friendlyName}
                        sx={{ ml: '0.5em' }}
                    />
                ))}
            </Tabs>
        );
    }

    /**
     * Form control inputs that affect the App Context
     */
    private renderFormControls(): JSX.Element {
        // TODO Show optional form controls based on selected AI
        return (
            <Box>
                <FormControl variant='standard' fullWidth sx={{ display: 'flex', flexDirection: 'row' }}>
                    <InputLabel id='ai-select-label'>AI</InputLabel>
                    <Select
                        id='ai-select'
                        labelId='ai-select-label'
                        defaultValue={AiType.NEGAMAX}
                        onChange={async (e: SelectChangeEvent) => await this.handleAiSelect(e)}
                        sx={{ m: 1 }}
                    >
                        {Object.values(AiType).map((aiType: AiType) => (
                            <MenuItem
                                key={aiType} 
                                value={aiType}
                            >
                                {capitalize(aiType)}
                            </MenuItem>
                        ))}
                    </Select>
                    
                    <TextField
                        id='max-score-input'
                        label='Max Score'
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="standard"
                        sx={{ m: 1, mt: 0 }}
                    />

                    {this.aiFormControls[this.state.ai as AiType]()}
                </FormControl>
            </Box>
        );
    }

    // ===================================================================
}
