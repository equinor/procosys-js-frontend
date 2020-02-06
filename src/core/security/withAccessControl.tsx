import React, { useState, useEffect } from 'react';
import {useCurrentPlant} from '../PlantContext';
import styled from 'styled-components';
import Error from '../../components/Error';
import { Loading } from '../../components';

const CenterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin-top: 1rem;
`;

const withAccessControl = (WrappedComponent: () => any, requiredPermissions: string[] = [] ): any => (props: any): any => {

    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    const {permissions} = useCurrentPlant();

    useEffect(() => {
        if (requiredPermissions.every((item) => permissions.indexOf(item) >= 0)) {
            setHasAccess(true);
        } else {
            setHasAccess(false);
        }
    }, [permissions]);

    if (hasAccess === null) {
        return (
            <CenterContainer>
                <Loading />
            </CenterContainer>
        );
    }
    if (hasAccess) {
        return (<WrappedComponent {...props} />);
    }
    return (
        <CenterContainer>
            <Error title='Access restricted' large />
        </CenterContainer>
    );

};

export default withAccessControl;
