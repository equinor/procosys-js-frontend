import {Button, Container} from './style';

import AuthUser from '../../auth/AuthUser';
import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import {useParams} from 'react-router-dom';

const Preservation = (): JSX.Element => {
    const user = useCurrentUser() as AuthUser;

    const { plant } = useParams();

    return (
        <Container>
            <h1>Preservation</h1>
            <h1>{user.fullname} - {plant}</h1>
            <br />
            <Button>Logout</Button>
        </Container>
    );
};

export default Preservation;
