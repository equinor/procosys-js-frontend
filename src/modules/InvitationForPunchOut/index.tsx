import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';
import { Container } from './style';
import { InvitationForPunchOutContextProvider } from './context/InvitationForPunchOutContext';
import React from 'react';
import ViewIPO from './views/ViewIPO/index';
import EditIPO from './views/CreateAndEditIPO/EditIPO';
import CreateIPO from './views/CreateAndEditIPO/CreateIPO';
import withAccessControl from '@procosys/core/security/withAccessControl';


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
                            component={CreateIPO}
                        />
                        <Route
                            path={'/EditIPO/:ipoId'}
                            exact
                            component={EditIPO}
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

export default withAccessControl(InvitationForPunchOut, ['IPO/READ'], ['IPO']);
