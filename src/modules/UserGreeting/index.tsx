import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { useUser } from '../../contexts/UserContext';

const UserGreeting: React.FC<any> = ({ match }: RouteComponentProps<any>) => {
    const user = useUser();

    return (
        <div className="section">
            <div className="row">
                <div className="col s12 center-align">
                    Hello {user.name}
                </div>
            </div>
        </div>
    )
}

export default UserGreeting
