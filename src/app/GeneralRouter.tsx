import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import ProcosysRouter from './ProcosysRouter';
import React from 'react';

const NoPlant = (): JSX.Element => {
    return <h1>TODO: Select first plant in list of available plants for user</h1>;
};

const GeneralRouter = (): JSX.Element => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={NoPlant} />
                <Route path="/:plant" component={ProcosysRouter} />
                <Route render={(): JSX.Element => <h3>404</h3>} />
            </Switch>
        </Router>
    );
};

export default GeneralRouter;
