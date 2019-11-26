import {
    Route,
    RouteComponentProps,
    BrowserRouter as Router,
    Switch,
    useRouteMatch
} from 'react-router-dom';

import Header from '../modules/Header';
import LazyRoute from '../components/LazyRoute';
import React from 'react';

const UserGreeting = React.lazy(() => import('./../modules/UserGreeting'));
const Preservation = React.lazy(() => import('./../modules/Preservation'));

const ProcosysRouter = (): JSX.Element => {
    const { path } = useRouteMatch();

    //Verify plant access
    //Store plant as default plant

    // Get all access roles
    // Cache them
    return (
        <Router>
            <Header />

            <Switch>
                <Route
                    path={path}
                    exact
                    component={(routeProps: RouteComponentProps): JSX.Element =>
                        LazyRoute(UserGreeting, routeProps)
                    }
                />
                <Route
                    path={`${path}/preservation`}
                    exact
                    component={(routeProps: RouteComponentProps): JSX.Element =>
                        LazyRoute(Preservation, routeProps)
                    }
                />
                <Route render={(): JSX.Element => <h3>404 - 2</h3>} />
            </Switch>
        </Router>
    );
};

export default ProcosysRouter;
