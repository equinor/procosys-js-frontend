import React, { ReactElement } from 'react';
import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';

import AddScope from './views/AddScope/AddScope';
import ClosedProjectWarning from './ClosedProjectWarning';
import EditTagProperties from './views/EditTagProperties/EditTagProperties';
import ErrorBoundary from '@procosys/components/ErrorBoundary';
import { PreservationContextProvider } from './context/PreservationContext';
import ScopeOverview from './views/ScopeOverview/ScopeOverview';
import withAccessControl from '../../core/security/withAccessControl';

const Preservation = (): JSX.Element => {

    const { url } = useRouteMatch();

    return (
        <PreservationContextProvider>
            <ClosedProjectWarning />
            <Router basename={url}>
                <Switch>
                    <Route
                        path={'/AddScope/:method'}
                        exact
                        component={(): ReactElement => (<ErrorBoundary><AddScope /></ErrorBoundary>)}
                    />
                    <Route
                        path={'/'}
                        exact
                        component={(): ReactElement => (<ErrorBoundary><ScopeOverview /></ErrorBoundary>)}
                    />
                    <Route
                        path={'/EditTagProperties/:tagId'}
                        exact
                        component={(): ReactElement => (<ErrorBoundary><EditTagProperties /></ErrorBoundary>)}
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
