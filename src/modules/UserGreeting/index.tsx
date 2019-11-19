import {Button, Container} from './style';
import React, { useState } from 'react'

import { RouteComponentProps } from 'react-router'
import { useAuth } from '../../contexts/AuthContext';

const UserGreeting: React.FC<any> = ({ match }: RouteComponentProps<any>) => {
    const { account } = useAuth();

    return (
        <Container>
                <h1>{account.name}</h1>
                <br />
                <Button>Logout</Button>
        </Container>
    )
}

export default UserGreeting
