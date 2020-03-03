import React, { useState, useEffect } from 'react';

import { Container, TagDetailsContainer, Details, GridFirstRow, GridSecondRow, RemarkContainer } from './PreservationTab.style';
import { TextField, Typography } from '@equinor/eds-core-react';
import { TagDetails, TagRequirement, TagRequirementRecordValues } from './../types';
import Requirements from './Requirements';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../../core/services/NotificationService';
import Spinner from '../../../../../../components/Spinner';

interface PreservationTabProps {
    tagDetails: TagDetails;
    refreshTagDetails: () => void;
    setDirty: () => void;
}

const PreservationTab = ({
    tagDetails,
    refreshTagDetails,
    setDirty
}: PreservationTabProps): JSX.Element => {
    const [tagRequirements, setTagRequirements] = useState<TagRequirement[] | null>(null);
    const { apiClient } = usePreservationContext();

    const getTagRequirements = async (): Promise<void> => {
        try {            
            const requirements = await apiClient.getTagRequirements(tagDetails.id);
            setTagRequirements(requirements);
        }
        catch (error) {
            console.error(`Get TagRequirements failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    useEffect(() => {
        setTagRequirements(null); // force full refresh
        getTagRequirements();
    }, [tagDetails]);    

    const recordTagRequirementValues = async (values: TagRequirementRecordValues): Promise<void> => {
        try {
            setTagRequirements(null); // trigger the spinner
        
            await apiClient.recordTagRequirementValues(tagDetails.id, values);            
            showSnackbarNotification('Requirement values saved', 5000, true);
        }
        catch (error) {
            console.error(`Record TagRequirement values failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
        finally {
            // refresh tag details and requirements
            refreshTagDetails();         
        }
    };

    const preserveRequirement = async (requirementId: number): Promise<void> => {
        try {
            setTagRequirements(null); // trigger the spinner
            await apiClient.preserveSingleRequirement(tagDetails.id, requirementId);

            setDirty();
            showSnackbarNotification('The requirement has been preserved.', 5000, true);
        }
        catch (error) {
            console.error(`Preserve requirement failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
        finally {
            // refresh tag details and requirements
            refreshTagDetails();
        }
    };

    const isReadOnly = (): boolean => tagDetails.status.toLowerCase() !== 'active';

    const getRequirementsSection = (): JSX.Element => {
        if (tagRequirements === null) {
            return <div style={{margin: 'calc(var(--grid-unit) * 5) auto'}}><Spinner medium /></div>;
        }

        return (
            <Requirements 
                requirements={tagRequirements} 
                readonly={isReadOnly()} 
                recordTagRequirementValues={recordTagRequirementValues} 
                preserveRequirement={preserveRequirement}
            />
        );
    };

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
            {
                getRequirementsSection()
            }
        </Container>
    );
};

export default PreservationTab; 