import React from 'react';
import Spinner from '../../components/Spinner';
import { hot } from 'react-hot-loader';

const Login = (): JSX.Element => {
    return (
        <>
            <Spinner />
        </>
    );
};

export default hot(module)(Login);
