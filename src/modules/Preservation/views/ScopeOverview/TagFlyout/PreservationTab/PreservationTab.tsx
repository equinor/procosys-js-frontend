import React from 'react';

import { Container, TagDetailsContainer, Details, GridFirstRow, GridSecondRow, RemarkContainer } from './PreservationTab.style';
import { TextField, Typography } from '@equinor/eds-core-react';
import { TagDetails, TagRequirement } from './../types';
import Requirements from './Requirements';

interface PreservationTabProps {
    details: TagDetails | undefined;
    requirements: TagRequirement[] | undefined;
}

const PreservationTab = ({
    details,
    requirements
}: PreservationTabProps): JSX.Element => {

    if (details === undefined) {
        return <div style={{margin: 'calc(var(--grid-unit) * 2)'}}>Missing data</div>;
    }

    return (
        <Container>
            <TagDetailsContainer>
                <Details>
                    <Typography variant='h6'>{details.description}</Typography>
                    <div style={{marginTop: 'calc(var(--grid-unit) * 2)'}}>
                        <GridFirstRow>
                            <Typography variant='caption' style={{gridColumn: '1', gridRow: '1'}}>Journey</Typography>
                            <Typography variant='caption' style={{gridColumn: '2', gridRow: '1'}}>Mode</Typography>
                            <Typography variant='caption' style={{gridColumn: '3', gridRow: '1'}}>Resp.</Typography>
                            <Typography variant='body_long' style={{gridColumn: '1', gridRow: '2'}}>{details.journeyTitle}</Typography>
                            <Typography variant='body_long' style={{gridColumn: '2', gridRow: '2'}}>{details.mode}</Typography>
                            <Typography variant='body_long' style={{gridColumn: '3', gridRow: '2'}}>{details.responsibleName}</Typography>
                        </GridFirstRow>
                    </div>
                    <div style={{marginTop: 'var(--grid-unit)'}}>
                        <GridSecondRow>
                            <Typography variant='caption' style={{gridColumn: '1', gridRow: '1'}}>Comm pkg</Typography>
                            <Typography variant='caption' style={{gridColumn: '2', gridRow: '1'}}>MC pkg</Typography>
                            <Typography variant='caption' style={{gridColumn: '3', gridRow: '1'}}>PO</Typography>
                            <Typography variant='caption' style={{gridColumn: '4', gridRow: '1'}}>Area</Typography>
                            <Typography variant='body_short' style={{gridColumn: '1', gridRow: '2'}}>{details.commPkgNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '2', gridRow: '2'}}>{details.mcPkgNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '3', gridRow: '2'}}>{details.purchaseOrderNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '4', gridRow: '2'}}>{details.areaCode}</Typography>
                        </GridSecondRow>
                    </div>               
                </Details>                
            </TagDetailsContainer>
            <RemarkContainer>
                <TextField id='remark' label='Remark' disabled />
            </RemarkContainer>
            <Requirements requirements={requirements} />
        </Container>
    );
};

export default PreservationTab; 