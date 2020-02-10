import React from 'react';

import { Container, TagDetailsContainer, Details, GridFirstRow, GridSecondRow, RemarkContainer } from './Preservation.style';
import { TextField } from '@equinor/eds-core-react';
import { TagDetails } from './../types';

interface PreservationProps {
    details: TagDetails | undefined;
}

const Preservation = ({
    details
}: PreservationProps): JSX.Element => {
    if (details === undefined) {
        return <div style={{margin: '16px'}}>Missing data</div>;
    }

    return (
        <Container>
            <TagDetailsContainer>
                <Details>
                    <div style={{display: 'flex'}}>
                        <div style={{fontWeight: 500, marginRight: '16px'}}>{details.description}</div>
                        <div style={{marginLeft: 'auto'}}>{details.nextDueDateString}</div>
                    </div>
                    <div style={{marginTop: '16px'}}>
                        <GridFirstRow>
                            <span style={{gridColumnStart: '1', gridRowStart: '1'}}>Journey</span>
                            <span style={{gridColumnStart: '2', gridRowStart: '1'}}>Mode</span>
                            <span style={{gridColumnStart: '3', gridRowStart: '1'}}>Resp.</span>
                            <span style={{gridColumnStart: '1', gridRowStart: '2'}}>{details.journeyTitle}</span>
                            <span style={{gridColumnStart: '2', gridRowStart: '2'}}>{details.mode}</span>
                            <span style={{gridColumnStart: '3', gridRowStart: '2'}}>{details.responsibleName}</span>
                        </GridFirstRow>
                    </div>
                    <div style={{marginTop: '16px'}}>
                        <GridSecondRow>
                            <span style={{gridColumnStart: '1', gridRowStart: '1'}}>Comm pkg</span>
                            <span style={{gridColumnStart: '2', gridRowStart: '1'}}>MC pkg</span>
                            <span style={{gridColumnStart: '3', gridRowStart: '1'}}>PO</span>
                            <span style={{gridColumnStart: '4', gridRowStart: '1'}}>Area</span>
                            <span style={{gridColumnStart: '1', gridRowStart: '2'}}>{details.commPkgNo}</span>
                            <span style={{gridColumnStart: '2', gridRowStart: '2'}}>{details.mcPkgNo}</span>
                            <span style={{gridColumnStart: '3', gridRowStart: '2'}}>{details.purchaseOrderNo}</span>
                            <span style={{gridColumnStart: '4', gridRowStart: '2'}}>{details.areaCode}</span>
                        </GridSecondRow>
                    </div>               
                </Details>                
            </TagDetailsContainer>
            <RemarkContainer>
                <TextField id="remark" label="Remark" disabled />
            </RemarkContainer>
        </Container>
    );
};

export default Preservation;