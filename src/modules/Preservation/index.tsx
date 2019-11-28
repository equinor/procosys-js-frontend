import {Button, Container} from './style';

import React from 'react';
import { useCurrentUser } from '../../core/UserContext';
import {useParams} from 'react-router-dom';

const Preservation = (): JSX.Element => {

    const user = useCurrentUser();

    const { plant } = useParams();

    return (
        <Container>
            <h1>Preservation</h1>
            <h1>{user.name} - {plant}</h1>
            <br />
            <Button>Logout</Button>
        </Container>
    );
};

export default Preservation;
