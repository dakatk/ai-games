// Basic React stuff
import React from 'react';

// Async component base class
import AsyncComponent from './AsyncComponent';

// React router components
import { 
    Link as RouterLink,
    Location,
    NavigateFunction,
    Outlet,
    Params
} from 'react-router-dom';

// MUI components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// MUI icons
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

// Other components
import ContextFormControls from './ContextFormControls';
import SettingsMenu from './SettingsMenu';

// AI types
import AiType from './ai/AiType';

// App context
import { 
    AppContext,
    AppContextData,
    DEFAULT_CONTEXT
} from './AppContext';

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
 * App component props (with router data)
 */
interface AppWithRouterProps {
    /**
     * Router data
     */
    router: {
        /**
         * Current location (URL)
         */
        location: Location,
        /**
         * Navigate function
         */
        navigate: NavigateFunction,
        /**
         * URL parameters
         */
        params: Readonly<Params<string>>
    }
}

/**
 * App component state
 */
interface AppState {
    /**
     * Name of selected tab
     */
    tab?: string;
    /**
     * Context for child components
     */
    context?: AppContextData;
    /**
     * Controls whether or not the settings menu is open
     */
    modalOpen?: boolean;
}

/**
 * Main component that handles the global menu bar and 
 * renders the respective component for any given route
 */
export default class App extends AsyncComponent<AppWithRouterProps, AppState> {
    // TODO Move to JSON files?
    // Menu navigation items
    private static navItems: Array<NavItem> = [
        {
            friendlyName: 'Tic-Tac-Toe',
            path: '/ai-games/tictactoe'
        },
        {
            friendlyName: 'Chess',
            path: '/ai-games/chess'
        }
    ];

    // ====================== Initialization =============================

    constructor(props: AppWithRouterProps) {
        super(props);

        // Determine which tab to show as selected from
        // the `pathname` of the current location (reported via React Router)
        const path: string = props.router.location.pathname;
        const tab: NavItem | undefined = App.navItems.find(
            (navItem: NavItem) => navItem.path === path
        );
        const tabName: string | undefined = tab?.friendlyName;

        this.state = {
            tab: tabName,
            context: DEFAULT_CONTEXT,
            modalOpen: false
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
     * Update app context via form controls
     */
    private async updateAppContext(context: AppContextData) {
        await this.setStateAsync({ context });
    }

    /**
     * Settings button onClick handler (opens modal)
     */
    private settingsModalOpen() {
        this.setState({ modalOpen: true });
    }

    /**
     * Settings modal onClose handler
     */
    private settingsModalClose() {
        this.setState({ modalOpen: false });
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
                <SettingsMenu 
                    open={this.state.modalOpen as boolean}
                    aiType={this.state.context?.aiType || AiType.MENACE}
                    onClose={() => this.settingsModalClose()}
                    onSave={() => {console.log('Save')}}
                    onLoad={() => {console.log('Load')}}
                />

                <Box className='menu'>
                    <AppBar component='nav'>
                        <Toolbar className='menu-bar'>
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
                                sx={{ mr: '1.6em', ml: '1em' }}
                            />

                            {/* TODO Move to settings menu */}
                            <ContextFormControls
                                context={this.state.context || DEFAULT_CONTEXT}
                                updateContext={(context: AppContextData) => this.updateAppContext(context)}
                            />

                            <Divider
                                flexItem
                                className='divider'
                                orientation='vertical' 
                                sx={{ ml: '1.1em' }}
                            />

                            <SettingsIcon 
                                className='settings-icon' 
                                onClick={() => this.settingsModalOpen()}
                            />
                        </Toolbar>
                    </AppBar>
                </Box>

                <Box className='component'>
                    <AppContext.Provider value={this.state.context || DEFAULT_CONTEXT}>
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
                sx={{ mr: '1em', display: { xs: 'none', sm: 'block' } }}
            >
                <HomeIcon className='home-icon' />
            </Typography>
        );
    }

    /**
     * Menu nav items
     */
    private renderNavItems(): JSX.Element {
        return (
            <Tabs 
                value={this.state.tab || false}
                onChange={(_: React.SyntheticEvent, tab: string) => this.handleTabChange(tab)}
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

    // ===================================================================
}
