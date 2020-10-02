import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';
import { Container } from './style';
import { InvitationForPunchOutContextProvider } from './context/InvitationForPunchOutContext';
import React from 'react';
import CreateIPO from './views/CreateIPO/CreateIPO';
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
                            component={CreateIPO}
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
