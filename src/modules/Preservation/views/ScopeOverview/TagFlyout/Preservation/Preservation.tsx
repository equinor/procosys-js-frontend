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
                    <div style={{fontWeight: 500}}>{details.description}</div>
                    <div style={{marginTop: '16px'}}>
                        <GridFirstRow>
                            <span style={{gridColumn: '1', gridRow: '1'}}>Journey</span>
                            <span style={{gridColumn: '2', gridRow: '1'}}>Mode</span>
                            <span style={{gridColumn: '3', gridRow: '1'}}>Resp.</span>
                            <span style={{gridColumn: '1', gridRow: '2'}}>{details.journeyTitle}</span>
                            <span style={{gridColumn: '2', gridRow: '2'}}>{details.mode}</span>
                            <span style={{gridColumn: '3', gridRow: '2'}}>{details.responsibleName}</span>
                        </GridFirstRow>
                    </div>
                    <div style={{marginTop: '16px'}}>
                        <GridSecondRow>
                            <span style={{gridColumn: '1', gridRow: '1'}}>Comm pkg</span>
                            <span style={{gridColumn: '2', gridRow: '1'}}>MC pkg</span>
                            <span style={{gridColumn: '3', gridRow: '1'}}>PO</span>
                            <span style={{gridColumn: '4', gridRow: '1'}}>Area</span>
                            <span style={{gridColumn: '1', gridRow: '2'}}>{details.commPkgNo}</span>
                            <span style={{gridColumn: '2', gridRow: '2'}}>{details.mcPkgNo}</span>
                            <span style={{gridColumn: '3', gridRow: '2'}}>{details.purchaseOrderNo}</span>
                            <span style={{gridColumn: '4', gridRow: '2'}}>{details.areaCode}</span>
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