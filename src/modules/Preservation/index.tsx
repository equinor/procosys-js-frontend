import React, { ReactElement } from 'react';
import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';

import AddScope from './views/AddScope/AddScope';
import ClosedProjectWarning from './ClosedProjectWarning';
import EditTagProperties from './views/EditTagProperties/EditTagProperties';
import ErrorBoundary from '@procosys/components/ErrorBoundary';
import { Helmet } from 'react-helmet';
import { PreservationContextProvider } from './context/PreservationContext';
import ScopeOverview from './views/ScopeOverview/ScopeOverview';
import withAccessControl from '../../core/security/withAccessControl';

const Preservation = (): JSX.Element => {

    const { url } = useRouteMatch();

    return (
        <>
            <Helmet titleTemplate={'ProCoSys - Preservation %s'}>
            </Helmet>
            <PreservationContextProvider>
                <ClosedProjectWarning />
                <Router basename={url}>
                    <Switch>
                        <Route
                            path={'/AddScope/:method/:duplicateTagId?'}
                            exact
                            component={(): ReactElement => (
                                <>
                                    <Helmet>
                                        <title>{'- AddScope'}</title>
                                    </Helmet>
                                    <ErrorBoundary><AddScope /></ErrorBoundary>
                                </>)}
                        />
                        <Route
                            path={'/'}
                            exact
                            component={(): ReactElement => (
                                <>
                                    <ErrorBoundary><ScopeOverview /></ErrorBoundary>
                                </>)}
                        />
                        <Route
                            path={'/EditTagProperties/:tagId'}
                            exact
                            component={(): ReactElement => (
                                <>
                                    <Helmet>
                                        <title>{'- EditTag'}</title>
                                    </Helmet>
                                    <ErrorBoundary><EditTagProperties /></ErrorBoundary>
                                </>)}
                        />
                        <Route
                            component={(): JSX.Element =>
                                (<h2>Sorry, this page does not exist</h2>)
                            }
                        />
                    </Switch>
                </Router>
            </PreservationContextProvider >
        </>
    );
};

export default withAccessControl(Preservation, ['PRESERVATION/READ']);
