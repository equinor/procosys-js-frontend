import React from 'react'
import { useUser } from '../contexts/UserContext';
import { Link, Switch, Route, BrowserRouter as Router, RouteComponentProps } from 'react-router-dom';
import UserGreeting from './../modules/UserGreeting';
import LazyRoute from '../components/LazyRoute';
import AuthenticationService from './../core/services/AuthenticationService'

const ProCoSysRouter = () => {
    return (
        <Router>
            <Link to="/hello">Welcome</Link>
            <Switch>
                <Route path="/hello" component={(routeProps: RouteComponentProps) => (LazyRoute(UserGreeting, routeProps))} />
                <Route path="/" exact render={() => <div><h3>Home</h3><button onClick={() => AuthenticationService.logout()}>Logout</button></div>} />
                <Route render={() => <h3>404</h3>} />
            </Switch>
        </Router>
    );
}

const index = () => {
    const user = useUser();
    console.log("User: ", user);
    return (
        <div>
            Hello {user.data.name}
            <ProCoSysRouter />
        </div>
    )
}

export default index
