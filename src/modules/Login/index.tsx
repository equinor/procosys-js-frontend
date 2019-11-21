import React from 'react';
import { hot } from 'react-hot-loader';
import { useProcosysContext } from '../../core/ProcosysContext';

const logo = require('./../../assets/img/equinor-logo.png');

const Login = (): JSX.Element => {
    const {auth} = useProcosysContext();

    return (
        <div className="section">
            <div className="row">
                <div className="col s12 center-align">
                    <img src={logo} className="responsive-img" />
                </div>
                <div className="col s12 center-align">
                    <button className="btn-large " onClick={(): void => auth.login()}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default hot(module)(Login);
