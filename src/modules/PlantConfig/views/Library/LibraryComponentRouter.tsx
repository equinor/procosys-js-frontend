import { Route, Switch, useRouteMatch, BrowserRouter } from 'react-router-dom';

import React from 'react';
import withAccessControl from '../../../../core/security/withAccessControl';

const LibraryComponentRouter = (): JSX.Element => {

    const path = useRouteMatch();
    console.log('URL: ', path);
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path={`${path.url}/TagFunction`}
                    exact
                    component={(): JSX.Element => <span>Hello tag function</span>}
                />
                <Route
                    path={`${path.url}/`}
                    exact
                    component={(): JSX.Element => <span>Hello router</span>}
                />
                <Route
                    component={(): JSX.Element =>
                        (<h2>Sorry, this page does not exist</h2>)
                    }
                />
            </Switch>
        </BrowserRouter>
    );
};

export default withAccessControl(LibraryComponentRouter, ['PRESERVATION/READ']);
