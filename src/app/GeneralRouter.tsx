import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import NoPlant from '../modules/NoPlant';
import ProcosysRouter from './ProcosysRouter';
import React from 'react';
import { UserContextProvider } from '../core/UserContext';

const Page404: React.FC = (): JSX.Element => {
    return (<h3>404</h3>);
};

const GeneralRouter = (): JSX.Element => {
    return (
        <UserContextProvider>
            <Router>
                <Switch>
                    <Route path="/" exact component={NoPlant} />
                    <Route path="/:plant" component={ProcosysRouter} />
                    <Route component={Page404} />
                </Switch>
            </Router>
        </UserContextProvider>
    );
};

export default GeneralRouter;
