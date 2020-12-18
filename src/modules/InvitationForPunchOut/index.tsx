import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';
import { Container } from './style';
import { InvitationForPunchOutContextProvider } from './context/InvitationForPunchOutContext';
import React from 'react';
import CreateAndEditIPO from './views/CreateAndEditIPO/CreateAndEditIPO';
import ViewIPO from './views/ViewIPO/index';
import withFeatureFlag from '../../core/features/withFeatureFlag';


const InvitationForPunchOut = (): JSX.Element => {
    const { url } = useRouteMatch();
    return (
        <InvitationForPunchOutContextProvider>
            <Container>
                <Router basename={url}>
                    <Switch>
                        <Route
                            path={'/CreateIPO/:projectId?/:commPkgNo?'}
                            exact
                            component={CreateAndEditIPO}
                        />
                        <Route
                            path={'/EditIPO/:ipoId'}
                            exact
                            component={CreateAndEditIPO}
                        />

                        <Route
                            path={'/:ipoId'}
                            exact
                            component={ViewIPO}
                        />
                        <Route
                            component={(): JSX.Element =>
                                (<h2>Sorry, this page does not exist</h2>)
                            }
                        />
                    </Switch>
                </Router>
            </Container>
        </InvitationForPunchOutContextProvider>
    );
};

export default withFeatureFlag(InvitationForPunchOut, ['IPO']);
