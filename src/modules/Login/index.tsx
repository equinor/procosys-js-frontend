import React from 'react';
import { hot } from 'react-hot-loader';
import { useUser } from './../../contexts/UserContext';
const logo = require('./../../assets/img/equinor-logo.png');
import AuthenticationService from '../../core/services/AuthenticationService';

const App = (props: any) => {
    console.log("We handled the user stuff! ");
    const user = useUser();

    return (
        <div className="section">
            <div className="row">
                <div className="col s12 center-align">
                    <img src={logo} className="responsive-img" />
                </div>
                <div className="col s12 center-align">
                    <button className="btn-large " onClick={() => AuthenticationService.login()}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default hot(module)(App);
