import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';

import { Container } from './style';
import CreateAndEditIPO from './views/CreateAndEditIPO/CreateAndEditIPO';
import CreateIPO from './views/CreateAndEditIPO/CreateIPO';
import EditIPO from './views/CreateAndEditIPO/EditIPO';
import { InvitationForPunchOutContextProvider } from './context/InvitationForPunchOutContext';
import React from 'react';
import SearchIPO from './views/SearchIPO';
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
                            path={'/'}
                            exact
                            component={SearchIPO}
                        />
                        <Route
                            path={'/CreateIPO/:projectName?/:commPkgNo?'}
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

export default withFeatureFlag(InvitationForPunchOut, ['IPO']);
