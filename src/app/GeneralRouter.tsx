import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import ProcosysRouter from './ProcosysRouter';
import React from 'react';

const NoPlant = (): JSX.Element => {
    return <h1>No plant selected</h1>;
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
