import React from 'react';

import { Container, TagDetailsContainer, TagDetails, GridFirstRow, GridSecondRow, RemarkContainer } from './Preservation.style';
import { TextField } from '@equinor/eds-core-react';

const Preservation = (): JSX.Element => {
    return (
        <Container>
            <TagDetailsContainer>
                <TagDetails>
                    <div style={{display: 'flex'}}>
                        <div style={{fontWeight: 500}}>
                            [Tag description]
                        </div>
                        <div style={{marginLeft: 'auto'}}>
                            [1234w56]
                        </div>
                    </div>
                    <div style={{marginTop: '16px'}}>
                        <GridFirstRow>
                            <span style={{gridColumnStart: '1', gridRowStart: '1'}}>Journey</span>
                            <span style={{gridColumnStart: '2', gridRowStart: '1'}}>Mode</span>
                            <span style={{gridColumnStart: '3', gridRowStart: '1'}}>Resp.</span>
                            <span style={{gridColumnStart: '1', gridRowStart: '2'}}>-</span>
                            <span style={{gridColumnStart: '2', gridRowStart: '2'}}>-</span>
                            <span style={{gridColumnStart: '3', gridRowStart: '2'}}>-</span>
                        </GridFirstRow>
                    </div>
                    <div style={{marginTop: '16px'}}>
                        <GridSecondRow>
                            <span style={{gridColumnStart: '1', gridRowStart: '1'}}>Comm pkg</span>
                            <span style={{gridColumnStart: '2', gridRowStart: '1'}}>MC pkg</span>
                            <span style={{gridColumnStart: '3', gridRowStart: '1'}}>PO</span>
                            <span style={{gridColumnStart: '4', gridRowStart: '1'}}>Area</span>
                            <span style={{gridColumnStart: '1', gridRowStart: '2'}}>-</span>
                            <span style={{gridColumnStart: '2', gridRowStart: '2'}}>-</span>
                            <span style={{gridColumnStart: '3', gridRowStart: '2'}}>-</span>
                            <span style={{gridColumnStart: '4', gridRowStart: '2'}}>-</span>
                        </GridSecondRow>
                    </div>               
                </TagDetails>                
            </TagDetailsContainer>
            <RemarkContainer>
                <TextField id="remark" label="Remark" disabled />
            </RemarkContainer>
        </Container>
    );
};

export default Preservation;