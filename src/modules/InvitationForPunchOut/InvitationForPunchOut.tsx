import React, { ReactElement } from 'react';
import { Route, Routes, useLocation, useMatch, useParams } from 'react-router-dom';
import { Container } from './style';
import CreateIPO from './views/CreateAndEditIPO/CreateIPO';
import EditIPO from './views/CreateAndEditIPO/EditIPO';
import { Helmet } from 'react-helmet';
import { InvitationForPunchOutContextProvider } from './context/InvitationForPunchOutContext';
import SearchIPO from './views/SearchIPO/SearchIpo';
import ViewIPO from './views/ViewIPO/ViewIPO';
import withAccessControl from '@procosys/core/security/withAccessControl';

const InvitationForPunchOut = (): JSX.Element => {
    const match = useMatch('/');
    const { pathname } = useLocation();


    const ala = useParams()


    console.log(1212,ala,pathname)

    return (
        <>
            <Helmet titleTemplate={'ProCoSys - IPO %s'}></Helmet>
            <InvitationForPunchOutContextProvider>
                <Container>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <Helmet>
                                        <title>{'- Search'}</title>
                                    </Helmet>
                                    <SearchIPO />
                                </>
                            }
                        />
                        <Route
                            path="/CreateIPO/:projectName/:commPkgNo"
                            element={
                                <>
                                    <Helmet>
                                        <title>{'- Create'}</title>
                                    </Helmet>
                                    <CreateIPO />
                                </>
                            }
                        />
                            <Route
                            path="/CreateIPO"
                            element={
                                <>
                                    <Helmet>
                                        <title>{'- Create'}</title>
                                    </Helmet>
                                    <CreateIPO />
                                </>
                            }
                        />

                        <Route
                            path="/EditIPO/:ipoId"
                            element={
                                <>
                                    <Helmet>
                                        <title>{'- Edit'}</title>
                                    </Helmet>
                                    <EditIPO />
                                </>
                            }
                        />
                        <Route
                            path="/:ipoId"
                            element={
                                <>
                                    <Helmet>
                                        <title>{'- View'}</title>
                                    </Helmet>
                                    <ViewIPO />
                                </>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <>
                                    <Helmet>
                                        <title>{'- NotFound'}</title>
                                    </Helmet>
                                    <h2>Sorry, this page does not exist 111</h2>
                                </>
                            }
                        />
                    </Routes>
                </Container>
            </InvitationForPunchOutContextProvider>
        </>
    );
};

export default withAccessControl(InvitationForPunchOut, ['IPO/READ'], ['IPO']);