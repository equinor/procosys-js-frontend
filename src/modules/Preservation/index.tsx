import {Button, Container} from './style';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {useParams} from 'react-router-dom';

const Preservation = (): JSX.Element => {
    const { account } = useAuth();
    const { plant } = useParams();

    return (
        <Container>
            <h1>Preservation</h1>
            <h1>{account.name} - {plant}</h1>
            <br />
            <Button>Logout</Button>
        </Container>
    );
};

export default Preservation;
