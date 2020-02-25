import React, { useState, useEffect } from 'react';

import { Container, TagDetailsContainer, Details, GridFirstRow, GridSecondRow, RemarkContainer } from './PreservationTab.style';
import { TextField, Typography } from '@equinor/eds-core-react';
import { TagDetails, TagRequirement, TagRequirementRecordValues } from './../types';
import Requirements from './Requirements';
import Spinner from '../../../../../../components/Spinner';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../../core/services/NotificationService';

interface PreservationTabProps {
    tagId: number | null;
    tagDetails: TagDetails | undefined;
    getTagDetails: () => void;
    updateRequirements: number;
}

const PreservationTab = ({
    tagId,
    tagDetails,
    getTagDetails,
    updateRequirements
}: PreservationTabProps): JSX.Element => {
    const [tagRequirements, setTagRequirements] = useState<TagRequirement[]>();
    const { apiClient } = usePreservationContext();

    const getTagRequirements = async (id: number): Promise<void> => {
        try {            
            const tagRequirements = await apiClient.getTagRequirements(id);
            setTagRequirements(tagRequirements);
        }
        catch (error) {
            console.error(`Get TagRequirements failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    const recordTagRequirementValues = async (values: TagRequirementRecordValues): Promise<void> => {
        if (tagId !== null) {
            try {
                setTagRequirements(undefined); // trigger the spinner
    
                await apiClient.recordTagRequirementValues(tagId, values);            
                showSnackbarNotification('Requirement values saved', 4000, true);
            }
            catch (error) {
                console.error(`Record TagRequirement values failed: ${error.message}`);
                showSnackbarNotification(error.message, 6000, true);
            }
            finally {
                getTagDetails();
                getTagRequirements(tagId);                
            }
        }
    };

    const isReadOnly = (): boolean => {
        return tagDetails 
            ? tagDetails.status.toLowerCase() !== 'active' 
            : false;
    };

    useEffect(() => {
        if (tagId !== null) {
            // re-render requirements when "header" actions are executed
            if (updateRequirements > 0) {
                setTagRequirements(undefined);
            }

            getTagRequirements(tagId);
        }
    }, [tagId, updateRequirements]);    

    if (tagDetails === undefined) {
        return <div style={{margin: 'calc(var(--grid-unit) * 5) auto'}}><Spinner medium /></div>;
    }

    return (
        <Container>
            <TagDetailsContainer>
                <Details>
                    <Typography variant='h6'>{tagDetails.description}</Typography>
                    <div style={{marginTop: 'calc(var(--grid-unit) * 2)'}}>
                        <GridFirstRow>
                            <Typography variant='caption' style={{gridColumn: '1', gridRow: '1'}}>Journey</Typography>
                            <Typography variant='caption' style={{gridColumn: '2', gridRow: '1'}}>Mode</Typography>
                            <Typography variant='caption' style={{gridColumn: '3', gridRow: '1'}}>Resp.</Typography>
                            <Typography variant='body_long' style={{gridColumn: '1', gridRow: '2'}}>{tagDetails.journeyTitle}</Typography>
                            <Typography variant='body_long' style={{gridColumn: '2', gridRow: '2'}}>{tagDetails.mode}</Typography>
                            <Typography variant='body_long' style={{gridColumn: '3', gridRow: '2'}}>{tagDetails.responsibleName}</Typography>
                        </GridFirstRow>
                    </div>
                    <div style={{marginTop: 'var(--grid-unit)'}}>
                        <GridSecondRow>
                            <Typography variant='caption' style={{gridColumn: '1', gridRow: '1'}}>Comm pkg</Typography>
                            <Typography variant='caption' style={{gridColumn: '2', gridRow: '1'}}>MC pkg</Typography>
                            <Typography variant='caption' style={{gridColumn: '3', gridRow: '1'}}>PO</Typography>
                            <Typography variant='caption' style={{gridColumn: '4', gridRow: '1'}}>Area</Typography>
                            <Typography variant='body_short' style={{gridColumn: '1', gridRow: '2'}}>{tagDetails.commPkgNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '2', gridRow: '2'}}>{tagDetails.mcPkgNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '3', gridRow: '2'}}>{tagDetails.purchaseOrderNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '4', gridRow: '2'}}>{tagDetails.areaCode}</Typography>
                        </GridSecondRow>
                    </div>               
                </Details>                
            </TagDetailsContainer>
            <RemarkContainer>
                <TextField id='remark' label='Remark' disabled />
            </RemarkContainer>
            <Requirements 
                requirements={tagRequirements} 
                readonly={isReadOnly()} 
                recordTagRequirementValues={recordTagRequirementValues} 
                updateRequirements={updateRequirements}
            />
        </Container>
    );
};

export default PreservationTab; 