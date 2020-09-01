import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';
import { Container } from './style';
import { CallForPunchOutContextProvider } from './context/CallForPunchOutContext';
import React from 'react';
import withAccessControl from '../../core/security/withAccessControl';
import AddCPO from './views/AddCPO/AddCPO';


const CallForPunchOut = (): JSX.Element => {

    const { url } = useRouteMatch();
    return (
        <CallForPunchOutContextProvider>
            <Container>
                <Router basename={url}>
                    <Switch>
                        <Route
                            path={'/AddCPO/:projectId?/:commPkgId?'}
                            exact
                            component={AddCPO}
                        />
                        <Route
                            component={(): JSX.Element =>
                                (<h2>Sorry, this page does not exist</h2>)
                            }
                        />
                    </Switch>
                </Router>
            </Container>
        </CallForPunchOutContextProvider>
    );
};

export default withAccessControl(CallForPunchOut, ['PRESERVATION/READ']);
