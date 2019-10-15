import React, { useState } from 'react'

import { RouteComponentProps } from 'react-router'
import { useAuth } from '../../contexts/AuthContext';

const UserGreeting: React.FC<any> = ({ match }: RouteComponentProps<any>) => {
    const {account} = useAuth();

    return (
        <div className="section">
            <div className="row">
                <div className="col s12 center-align">
                    Hello {account.name}
                </div>
            </div>
        </div>
    )
}

export default UserGreeting
