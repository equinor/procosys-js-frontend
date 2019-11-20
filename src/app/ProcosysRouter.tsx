import {
    Route,
    RouteComponentProps,
    BrowserRouter as Router,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import Header from '../modules/Header';
import LazyRoute from '../components/LazyRoute';
import Preservation from './../modules/Preservation';
import React from 'react';
import UserGreeting from './../modules/UserGreeting';

const ProcosysRouter = (): JSX.Element => {
    const { path } = useRouteMatch();
    console.log('path: ', path);
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
                <Route path={`${path}/preservation`} component={Preservation} />
                <Route render={(): JSX.Element => <h3>404 - 2</h3>} />
            </Switch>
        </Router>
    );
};

export default ProcosysRouter;
