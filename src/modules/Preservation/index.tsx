import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';

import AddScope from './views/AddScope/AddScope';
import { Container } from './style';
import EditTagProperties from './views/EditTagProperties/EditTagProperties';
import { PreservationContextProvider } from './context/PreservationContext';
import React from 'react';
import ScopeOverview from './views/ScopeOverview/ScopeOverview';
import withAccessControl from '../../core/security/withAccessControl';

const Preservation = (): JSX.Element => {

    const { url } = useRouteMatch();
    return (
        <PreservationContextProvider>
            <Router basename={url}>
                <Switch>
                    <Route
                        path={'/AddScope/:method'}
                        exact
                        component={AddScope}
                    />
                    <Route
                        path={'/'}
                        exact
                        component={ScopeOverview}
                    />
                    <Route
                        path={'/EditTagProperties/:tagId'}
                        exact
                        component={EditTagProperties}
                    />
                    <Route
                        component={(): JSX.Element =>
                            (<h2>Sorry, this page does not exist</h2>)
                        }
                    />
                </Switch>
            </Router>
        </PreservationContextProvider >
    );
};

export default withAccessControl(Preservation, ['PRESERVATION/READ']);
