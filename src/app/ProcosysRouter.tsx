import {
    Route,
    RouteComponentProps,
    Switch,
    useParams,
    useRouteMatch,
} from 'react-router-dom';

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
    const { path } = useRouteMatch();
    const { plant } = useParams() as any;

    return (
        <AnalyticsContextProvider>
            <PlantContextProvider>
                <DirtyContextProvider>
                    <ProCoSysRootLayout>
                        <QuickSearchContextProvider>
                            <Header />
                            <div id="root-content">
                                <Switch key={plant}>
                                    <Route
                                        path={path}
                                        exact
                                        component={(
                                            routeProps: RouteComponentProps
                                        ): JSX.Element =>
                                            LazyRoute(UserGreeting, routeProps)
                                        }
                                    />
                                    <Route
                                        path={`${path}/preservation`}
                                        component={(
                                            routeProps: RouteComponentProps
                                        ): JSX.Element =>
                                            LazyRoute(Preservation, routeProps)
                                        }
                                    />
                                    <Route
                                        path={`${path}/libraryv2`}
                                        component={(
                                            routeProps: RouteComponentProps
                                        ): JSX.Element =>
                                            LazyRoute(PlantConfig, routeProps)
                                        }
                                    />
                                    <Route
                                        path={`${path}/invitationforpunchout`}
                                        component={(
                                            routeProps: RouteComponentProps
                                        ): JSX.Element =>
                                            LazyRoute(
                                                InvitationForPunchOut,
                                                routeProps
                                            )
                                        }
                                    />

                                    <Route
                                        path={`${path}/quicksearch`}
                                        component={(
                                            routeProps: RouteComponentProps
                                        ): JSX.Element =>
                                            LazyRoute(QuickSearch, routeProps)
                                        }
                                    />
                                    <Route component={Page404} />
                                </Switch>
                            </div>
                        </QuickSearchContextProvider>
                    </ProCoSysRootLayout>
                </DirtyContextProvider>
            </PlantContextProvider>
        </AnalyticsContextProvider>
    );
};

export default ProcosysRouter;
