import { Route, RouteComponentProps, BrowserRouter as Router, Switch } from 'react-router-dom';

import LazyRoute from '../components/LazyRoute';
import Preservation from './../modules/Preservation';
import ProcosysRouter from './ProcosysRouter';
import React from 'react';
import UserGreeting from './../modules/UserGreeting';

const NoPlant = () => {
    return (<h1>No plant selected</h1>)
};

const GeneralRouter = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={(routeProps: RouteComponentProps) => (<NoPlant />)} />
                <Route path="/:plant" component={ProcosysRouter} />
                <Route render={() => <h3>404</h3>} />
            </Switch>
        </Router>
    );
}

export default GeneralRouter;