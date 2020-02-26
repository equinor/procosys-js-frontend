import React, { useState, useEffect } from 'react';

import { Container, TagDetailsContainer, Details, GridFirstRow, GridSecondRow, RemarkContainer } from './PreservationTab.style';
import { TextField, Typography } from '@equinor/eds-core-react';
import { TagDetails, TagRequirement, TagRequirementRecordValues } from './../types';
import Requirements from './Requirements';
import Spinner from '../../../../../../components/Spinner';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../../core/services/NotificationService';

interface PreservationTabProps {
    tagDetails: TagDetails | null;
    refreshTagDetails: () => void;
}

const PreservationTab = ({
    tagDetails,
    refreshTagDetails
}: PreservationTabProps): JSX.Element => {
    const [tagRequirements, setTagRequirements] = useState<TagRequirement[] | null>(null);
    const { apiClient } = usePreservationContext();

    const getTagRequirements = async (): Promise<void> => {
        if (tagDetails) {
            try {            
                const tagRequirements = await apiClient.getTagRequirements(tagDetails.id);
                setTagRequirements(tagRequirements);
            }
            catch (error) {
                console.error(`Get TagRequirements failed: ${error.message}`);
                showSnackbarNotification(error.message, 5000, true);
            }
        }
    };

    useEffect(() => {
        setTagRequirements(null); // force full refresh
        getTagRequirements();
    }, [tagDetails]);    

    const recordTagRequirementValues = async (values: TagRequirementRecordValues): Promise<void> => {
        if (tagDetails) {
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
        }
    };

    const preserveRequirement = async (requirementId: number): Promise<void> => {
        if (tagDetails) {
            try {
                setTagRequirements(null); // trigger the spinner

                await apiClient.preserveSingleRequirement(tagDetails.id, requirementId);
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
        }
    };

    const isReadOnly = (): boolean => {
        if (tagDetails) {
            tagDetails.status.toLowerCase() !== 'active';
        }

        return false;
    };

    if (tagDetails === null) {
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
                preserveRequirement={preserveRequirement}
            />
        </Container>
    );
};

export default PreservationTab; 