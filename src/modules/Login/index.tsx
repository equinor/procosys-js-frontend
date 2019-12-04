import Loading from '../../components/Loading';
import React from 'react';
import { hot } from 'react-hot-loader';

const Login = (): JSX.Element => {
    return (
        <Loading title="Authenticating" />
    );
};

export default hot(module)(Login);
