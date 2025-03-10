import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container } from './style';
import CreateIPO from './views/CreateAndEditIPO/CreateIPO';
import EditIPO from './views/CreateAndEditIPO/EditIPO';
import { Helmet } from 'react-helmet';
import { InvitationForPunchOutContextProvider } from './context/InvitationForPunchOutContext';
import SearchIPO from './views/SearchIPO/SearchIpo';
import ViewIPO from './views/ViewIPO/ViewIPO';
import withAccessControl from '@procosys/core/security/withAccessControl';

const InvitationForPunchOut = (): JSX.Element => {
    const CreateIPOLayout = () => (
        <>
            <Helmet>
                <title>{'- Create'}</title>
            </Helmet>
            <CreateIPO />
        </>
    );

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

                        <Route path="/CreateIPO" element={<CreateIPOLayout />}>
                            <Route path="/CreateIPO" element={<CreateIPO />} />
                            <Route
                                path="All%20projects"
                                element={<CreateIPO />}
                            />

                            <Route
                                path=":projectName"
                                element={<CreateIPO />}
                            />
                            <Route
                                path=":projectName/:commPkgNo"
                                element={<CreateIPO />}
                            />
                        </Route>

                        <Route
                            path={`EditIPO/:ipoId`}
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
                            path=":ipoId"
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
                                    <h2>Sorry, this page does not exist</h2>
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
