import { Link, Route, RouteComponentProps, BrowserRouter as Router, Switch } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react'
import { ThemeProvider } from 'styled-components';

import LazyRoute from '../components/LazyRoute';
import Spinner from '../components/Spinner';
import UserGreeting from './../modules/UserGreeting';
import { hot } from 'react-hot-loader';
import { useAuth } from '../contexts/AuthContext';
import Header from '../modules/Header';
const Login = React.lazy(() => import('../modules/Login'));

import theme from './../assets/theme';



const ProCoSysRouter = () => {
    const auth = useAuth();
    return (
        <Router>
            <Header />
            <Link to="/hello">Welcome</Link>
            <Switch>
                <Route path="/hello" component={(routeProps: RouteComponentProps) => (LazyRoute(UserGreeting, routeProps))} />
                <Route path="/" exact render={() => <div><h3>Home</h3><button onClick={() => auth.logout()}>Logout</button></div>} />
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
