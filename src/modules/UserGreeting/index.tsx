import {Button, Container} from './style';

import AuthUser from '../../auth/AuthUser';
import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import {useParams} from 'react-router-dom';
import { useProcosysContext } from '../../core/ProcosysContext';

const UserGreeting = (): JSX.Element => {
    const user = useCurrentUser() as AuthUser;
    const {auth} = useProcosysContext();
    const { plant } = useParams();

    return (
        <Container>
            <h1>{user.fullname} - {plant}</h1>
            <br />
            <Button onClick={(): void => auth.logout()}>Logout</Button>
        </Container>
    );
};

export default UserGreeting;
