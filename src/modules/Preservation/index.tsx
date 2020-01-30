import { Route, Router, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import AddScope from './views/AddScope/AddScope';
import { Container } from './style';
import { PreservationContextProvider } from './context/PreservationContext';
import React from 'react';
import ScopeOverview from './views/ScopeOverview/ScopeOverview';

const Preservation = (): JSX.Element => {

    const { path } = useRouteMatch();
    const history = useHistory();

    return (
        <PreservationContextProvider>
            <Container>
                <Router history={history}>
                    <Switch>
                        <Route
                            path={`${path}/AddScope`}
                            exact
                            component={AddScope}
                        />
                        <Route
                            path={path}
                            exact
                            component={ScopeOverview}
                        />
                        <Route
                            component={(): JSX.Element =>
                                (<h2>Sorry, this page does not exist</h2>)
                            }
                        />
                    </Switch>
                </Router>
            </Container>
        </PreservationContextProvider>
    );
};

export default Preservation;
