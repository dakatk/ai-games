// Basic React stuff
import React from 'react';

// React router components
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

// React router hooks
import {
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';

// App components
import App from './app/App';
import Home from './app/Home';
import TicTacToe from './app/game/TicTacToe';
import Chess from './app/game/Chess';
import NotFound from './app/NotFound';

/**
 * RIP `withRouter` from React Router v5
 */
function withRouter(Component: any): (props: any) => JSX.Element {
    function ComponentWithRouterProp(props: any) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

const AppComponent: (props: any) => JSX.Element = withRouter(App);

/**
 * App routing
 */
export default class Routing extends React.Component {
    /**
     * Creates a routing tree based on parent route `homePath`
     * 
     * @param homePath Parent path for all nested routes (e.g., '/')
     */
    nestedRoutes(homePath: string) {
        return (
            <Route path={homePath} element={<AppComponent />}>
                <Route path='' element={<Home />} />
                <Route path='tictactoe' element={<TicTacToe searchDepth={10} />} />
                <Route path='chess' element={<Chess searchDepth={4} />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        )
    }

    render() {
        return (
            <Router>
                <Routes>
                    {this.nestedRoutes('/')}
                    {this.nestedRoutes('/ai-games')}
                </Routes>
            </Router>
        )
    }
}