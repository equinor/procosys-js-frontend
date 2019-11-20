import {Button, Container} from './style';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {useParams} from 'react-router-dom';

const UserGreeting = (): JSX.Element => {
    const { account } = useAuth();
    const { plant } = useParams();
    const auth = useAuth();

    return (
        <Container>
            <h1>{account.name} - {plant}</h1>
            <br />
            <Button onClick={auth.logout}>Logout</Button>
        </Container>
    );
};

export default UserGreeting;
