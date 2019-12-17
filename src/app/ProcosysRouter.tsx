import {
    Route,
    RouteComponentProps,
    Switch,
    useParams,
    useRouteMatch
} from 'react-router-dom';

import Header from '../modules/Header';
import LazyRoute from '../components/LazyRoute';
import { PlantContextProvider } from '../core/PlantContext';
import React from 'react';

const UserGreeting = React.lazy(() => import('./../modules/UserGreeting'));
const Preservation = React.lazy(() => import('./../modules/Preservation'));

const Page404 = (): JSX.Element => {
    return <h3>404 - 2</h3>;
};

const ProcosysRouter = (): JSX.Element => {
    const { path } = useRouteMatch();
    const {plant} = useParams();
    return (
        <PlantContextProvider>
            <Header />

            <Switch key={plant}>
                <Route
                    path={path}
                    exact
                    component={(routeProps: RouteComponentProps): JSX.Element =>
                        LazyRoute(UserGreeting, routeProps)
                    }
                />
                <Route
                    path={`${path}/preservation`}
                    exact
                    component={(routeProps: RouteComponentProps): JSX.Element =>
                        LazyRoute(Preservation, routeProps)
                    }
                />
                <Route component={Page404} />
            </Switch>
        </PlantContextProvider>
    );
};

export default ProcosysRouter;
