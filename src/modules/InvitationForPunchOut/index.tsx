import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';
import { Container } from './style';
import { InvitationForPunchOutContextProvider } from './context/InvitationForPunchOutContext';
import React from 'react';
import withAccessControl from '../../core/security/withAccessControl';
import CreateIPO from './views/CreateIPO/CreateIPO';


const InvitationForPunchOut = (): JSX.Element => {

    const { url } = useRouteMatch();
    return (
        <InvitationForPunchOutContextProvider>
            <Container>
                <Router basename={url}>
                    <Switch>
                        <Route
                            path={'/CreateIPO/:projectId?/:commPkgId?'}
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

export default withAccessControl(InvitationForPunchOut, ['PRESERVATION/READ']);
