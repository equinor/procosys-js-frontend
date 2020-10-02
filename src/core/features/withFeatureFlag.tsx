import React, { useState, useEffect, ReactElement } from 'react';
import {useCurrentPlant} from '../PlantContext';
import styled from 'styled-components';
import Error from '../../components/Error';
import { Loading } from '../../components';
import {ProCoSysSettings} from '../ProCoSysSettings';

const CenterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin-top: 1rem;
`;

const withFeatureFlag = (WrappedComponent: () => JSX.Element, featureFlag: string[] = [] ): React.ComponentType<any> => (props: any): ReactElement => {

    const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

    useEffect(() => {
        if (featureFlag.every((item) => ProCoSysSettings.featureIsEnabled(item))) {
            setFeatureEnabled(true);
        } else {
            setFeatureEnabled(false);
        }
    }, [featureFlag]);

    if (featureEnabled === null) {
        return (
            <CenterContainer>
                <Loading />
            </CenterContainer>
        );
    }
    if (featureEnabled) {
        return (<WrappedComponent {...props} />);
    }
    return (
        <CenterContainer>
            <Error title='Feature disabled' large />
        </CenterContainer>
    );

};

export default withFeatureFlag;
