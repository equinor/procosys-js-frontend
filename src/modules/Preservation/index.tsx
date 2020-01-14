import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Container } from './style';
import { PreservationContextProvider } from './context/PreservationContext';
import ScopeOverview from './views/ScopeOverview/ScopeOverview';
import AddScope from './views/AddScope/AddScope';

const Preservation = (): JSX.Element => {

    const { path } = useRouteMatch();

    return (
        <PreservationContextProvider>
            <Container>
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
            </Container>
        </PreservationContextProvider>
    );
};

export default Preservation;
