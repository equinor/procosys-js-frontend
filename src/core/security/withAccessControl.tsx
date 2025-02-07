import React, { useState, useEffect, ReactElement } from 'react';
import { useCurrentPlant } from '../PlantContext';
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

const withAccessControl =
    (
        WrappedComponent: () => JSX.Element,
        requiredPermissions: string[] = [],
        featureFlags: string[] = []
    ): React.ComponentType<any> =>
    (props: any): ReactElement => {
        const [hasAccess, setHasAccess] = useState<boolean | null>(null);
        const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(
            null
        );

        const { permissions } = useCurrentPlant();

        useEffect(() => {
            if (
                requiredPermissions.every(
                    (item) => permissions.indexOf(item) >= 0
                )
            ) {
                setHasAccess(true);
            } else {
                setHasAccess(false);
            }
        }, [permissions]);

        useEffect(() => {
            if (
                featureFlags.every(
                    (item) => window.FEATURE_FLAGS[item] || false
                )
            ) {
                setFeatureEnabled(true);
            } else {
                setFeatureEnabled(false);
            }
        }, [featureFlags]);

        if (hasAccess === null || featureEnabled === null) {
            return (
                <CenterContainer>
                    <Loading />
                </CenterContainer>
            );
        }

        if (!featureEnabled) {
            return (
                <CenterContainer>
                    <Error title="Feature disabled" large />
                </CenterContainer>
            );
        }

        if (hasAccess && featureEnabled) {
            return <WrappedComponent {...props} />;
        }

        return (
            <CenterContainer>
                <Error title="Access restricted" large />
            </CenterContainer>
        );
    };

export default withAccessControl;
