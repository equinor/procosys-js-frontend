import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import NoPlant from '../modules/NoPlant';
import ProcosysRouter from './ProcosysRouter';
import React from 'react';

const Page404: React.FC = (): JSX.Element => {
    return <h3>404</h3>;
};

/**
 * Makes sure that the user has selected a plant
 * before continuing their journey into the main application
 */
const GeneralRouter = (): JSX.Element => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={NoPlant} />
                <Route path="/:plant" component={ProcosysRouter} />
                <Route component={Page404} />
            </Switch>
        </Router>
    );
};

export default GeneralRouter;
