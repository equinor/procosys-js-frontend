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

const Page404 = (): JSX.Element => {
    return <h3>404 - 2</h3>;
};

const ProcosysRouter = (): JSX.Element => {
    const { path } = useRouteMatch();

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
                <Route component={Page404} />
            </Switch>
        </Router>
    );
};

export default ProcosysRouter;
