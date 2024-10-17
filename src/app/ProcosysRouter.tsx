import { Route, Routes, useLocation, useParams } from 'react-router-dom';

import { AnalyticsContextProvider } from '@procosys/core/services/Analytics/AnalyticsContext';
import { DirtyContextProvider } from '../core/DirtyContext';
import ErrorBoundary from '@procosys/components/ErrorBoundary';
import Header from '../modules/Header';
import LazyRoute from '../components/LazyRoute';
import { PlantContextProvider } from '../core/PlantContext';
import { ProCoSysRootLayout } from './index.style';
import React from 'react';
import { QuickSearchContextProvider } from '@procosys/modules/QuickSearch/context/QuickSearchContext';
import QuickSearch from '@procosys/modules/QuickSearch';

const UserGreeting = React.lazy(() => import('./../modules/UserGreeting'));
const Preservation = React.lazy(() => import('./../modules/Preservation'));
const PlantConfig = React.lazy(() => import('./../modules/PlantConfig'));
const InvitationForPunchOut = React.lazy(
    () => import('../modules/InvitationForPunchOut/InvitationForPunchOut')
);

const Page404 = (): JSX.Element => {
    return <h3>404 - 2</h3>;
};

const ProcosysRouter = (): JSX.Element => {
    const { pathname } = useLocation();
    const { plant } = useParams() as any;

    return (
        <AnalyticsContextProvider>
            <PlantContextProvider>
                <DirtyContextProvider>
                    <ProCoSysRootLayout>
                        <QuickSearchContextProvider>
                            <Header />
                            <div id="root-content">
                                <Routes key={plant}>
                                    <Route
                                        path={'/'}
                                        element={
                                            <ErrorBoundary>
                                                {LazyRoute(UserGreeting)}
                                            </ErrorBoundary>
                                        }
                                    />
                                    <Route
                                        path="preservation/*"
                                        element={
                                            <ErrorBoundary>
                                                {LazyRoute(Preservation)}
                                            </ErrorBoundary>
                                        }
                                    />
                                    <Route
                                        path="libraryv2/*"
                                        element={
                                            <ErrorBoundary>
                                                {LazyRoute(PlantConfig)}
                                            </ErrorBoundary>
                                        }
                                    />
                                    <Route
                                        path="invitationforpunchout/*"
                                        element={
                                            <ErrorBoundary>
                                                {LazyRoute(
                                                    InvitationForPunchOut
                                                )}
                                            </ErrorBoundary>
                                        }
                                    />
                                    <Route
                                        path="quicksearch" // not used for the moment
                                        element={
                                            <ErrorBoundary>
                                                {LazyRoute(QuickSearch)}
                                            </ErrorBoundary>
                                        }
                                    />
                                    <Route path="*" element={<Page404 />} />
                                </Routes>
                            </div>
                        </QuickSearchContextProvider>
                    </ProCoSysRootLayout>
                </DirtyContextProvider>
            </PlantContextProvider>
        </AnalyticsContextProvider>
    );
};

export default ProcosysRouter;
