import { Link, Route, RouteComponentProps, BrowserRouter as Router, Switch } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react'

import Header from '../modules/Header';
import LazyRoute from '../components/LazyRoute';
import Spinner from '../components/Spinner';
import { ThemeProvider } from 'styled-components';
import UserGreeting from './../modules/UserGreeting';
import { hot } from 'react-hot-loader';
import theme from './../assets/theme';
import { useAuth } from '../contexts/AuthContext';

const Login = React.lazy(() => import('../modules/Login'));





const ProCoSysRouter = () => {
    const auth = useAuth();
    return (
        <Router>
            <Header />
            
            <Switch>
                <Route path="/" exact component={(routeProps: RouteComponentProps) => (LazyRoute(UserGreeting, routeProps))} />
                <Route render={() => <h3>404</h3>} />
            </Switch>
        </Router>
    );
}

const App = () => {
    const auth = useAuth();
    auth.handleRedirectCallback((err) => console.log("Redirect Err", err));

    useEffect(() => {
        console.log("AuthContext: ", auth);
    }, [auth])

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Spinner />}>
                {auth.account ? <ProCoSysRouter /> : <Login />}
            </Suspense>
        </ThemeProvider>
    )
}

export default hot(module)(App)
