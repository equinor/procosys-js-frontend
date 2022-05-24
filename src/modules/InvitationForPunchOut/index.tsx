import React, { ReactElement } from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import { Container } from './style';
import CreateIPO from './views/CreateAndEditIPO/CreateIPO';
import EditIPO from './views/CreateAndEditIPO/EditIPO';
import { Helmet } from 'react-helmet';
import { InvitationForPunchOutContextProvider } from './context/InvitationForPunchOutContext';
import SearchIPO from './views/SearchIPO';
import ViewIPO from './views/ViewIPO/ViewIPO';
import withAccessControl from '@procosys/core/security/withAccessControl';

const InvitationForPunchOut = (): JSX.Element => {
    const { url } = useRouteMatch();
    return (
        <>
            <Helmet titleTemplate={'ProCoSys - IPO %s'}></Helmet>
            <InvitationForPunchOutContextProvider>
                <Container>
                    <Router basename={url}>
                        <Switch>
                            <Route
                                path={'/'}
                                exact
                                component={(): ReactElement => (
                                    <>
                                        <Helmet>
                                            <title>{'- Search'}</title>
                                        </Helmet>
                                        <SearchIPO />
                                    </>
                                )}
                            />
                            <Route
                                path={'/CreateIPO/:projectName?/:commPkgNo?'}
                                exact
                                component={(): ReactElement => (
                                    <>
                                        <Helmet>
                                            <title>{'- Create'}</title>
                                        </Helmet>
                                        <CreateIPO />
                                    </>
                                )}
                            />
                            <Route
                                path={'/EditIPO/:ipoId'}
                                exact
                                component={(): ReactElement => (
                                    <>
                                        <Helmet>
                                            <title>{'- Edit'}</title>
                                        </Helmet>
                                        <EditIPO />
                                    </>
                                )}
                            />

                            <Route
                                path={'/:ipoId'}
                                exact
                                component={(): ReactElement => (
                                    <>
                                        <Helmet>
                                            <title>{'- View'}</title>
                                        </Helmet>
                                        <ViewIPO />
                                    </>
                                )}
                            />
                            <Route
                                component={(): ReactElement => (
                                    <>
                                        <Helmet>
                                            <title>{'- NotFound'}</title>
                                        </Helmet>
                                        <h2>Sorry, this page does not exist</h2>
                                    </>
                                )}
                            />
                        </Switch>
                    </Router>
                </Container>
            </InvitationForPunchOutContextProvider>
        </>
    );
};

export default withAccessControl(InvitationForPunchOut, ['IPO/READ'], ['IPO']);
