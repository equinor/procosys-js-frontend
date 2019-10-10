import './assets/sass/global.scss';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import UserContext from './contexts/UserContext';
import AuthenticationService from './core/services/AuthenticationService';
import Spinner from './components/spinner';

const App = React.lazy(() => import('./app/index'));
const Login = React.lazy(() => import('./modules/Login'));
const settings = require('../settings.json');

var authParams = {
    scopes: settings.defaultScopes,
};

AuthenticationService.handleRedirectCallback((err) => {
    console.log("An error occured while logging in", err);
});

const userAccount = AuthenticationService.getUserData();

let accessToken = undefined;
if (userAccount) {
    AuthenticationService.getAccessToken(authParams).then(function (response) {
        accessToken = response.accessToken;
    });
}



var element = document.createElement('div');
element.setAttribute('id', 'root');
element.setAttribute('class', 'container');
document.body.appendChild(element);

ReactDOM.render(
    <UserContext.Provider value={{ data: userAccount, accessToken }}>
        <Suspense fallback={() => (<Spinner />)}>
            {userAccount ? <App /> : <Login />}
        </Suspense>
    </UserContext.Provider>,
    document.getElementById('root'));
