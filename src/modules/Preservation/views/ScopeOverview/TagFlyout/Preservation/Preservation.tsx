import React from 'react';

import { Container, TagDetailsContainer, Details, GridFirstRow, GridSecondRow, RemarkContainer, RequirementContainer, RequirementSection, Field } from './Preservation.style';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { TagDetails } from './../types';
import PreservationIcon from '../../../PreservationIcon';

const testData = [
    {
        id: 1,
        requirementTitle: 'Jump around',
        definitionTitle: 'Jump around',
        code: 'rotation',
        interval: '4 weeks',
        next: '2020w16',
        fields: [
            {
                id: 10,
                label: 'Jump up, jump up, and get down!',
                fieldType: 'Info'
            }
        ]
    },
    {
        id: 2,
        requirementTitle: 'Please do the needful',
        definitionTitle: 'Bang with hammer',
        code: 'ir test',
        interval: '4 weeks',
        next: '2020w34',
        fields: [
            {
                id: 20,
                label: 'Bang hard 50 times',
                fieldType: 'Info'
            },
            {
                id: 30,
                label: 'Turn inside-out',
                fieldType: 'Info'
            }
        ]        
    }       
];

interface PreservationProps {
    details: TagDetails | undefined;
}

const Preservation = ({
    details
}: PreservationProps): JSX.Element => {

    const getRequirementField = (fieldType: string, label: string): JSX.Element => {
        switch (fieldType) {
            case 'Info':
                return <Typography variant='body_long'>{label}</Typography>;
            default:
                return <div>Unknown field type</div>;
        }
    };

    const getRequirements = (): JSX.Element => {
        return (
            <div>
                {
                    testData.map(data => {
                        return (
                            <RequirementContainer key={data.id}>
                                <RequirementSection>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Typography variant='h4'>
                                            {data.requirementTitle}
                                        </Typography>
                                        <div style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}>
                                            <PreservationIcon variant={data.code} />
                                        </div>
                                    </div>
                                    <Typography variant='h6'>
                                        {data.definitionTitle}
                                    </Typography>                                    
                                    <div style={{display: 'flex', alignItems: 'baseline', marginTop: 'var(--grid-unit)'}}>
                                        <Typography variant='caption'>Interval</Typography>
                                        <Typography variant='body_short' bold style={{marginLeft: 'var(--grid-unit)'}}>{data.interval}</Typography>
                                        <Typography variant='caption' style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}>Next</Typography>
                                        <Typography variant='body_short' bold style={{marginLeft: 'var(--grid-unit)'}}>{data.next}</Typography>
                                    </div>
                                </RequirementSection>
                                <RequirementSection>
                                    {
                                        data.fields.map(field => {
                                            return (
                                                <Field key={field.id}>
                                                    {
                                                        getRequirementField(field.fieldType, field.label)
                                                    }
                                                </Field>
                                            );
                                        })
                                    }
                                </RequirementSection>
                                <RequirementSection>
                                    <TextField 
                                        id={`requirementComment${data.id}`}
                                        label='Comment for this preservation period (optional)'
                                        placeholder='Write here'
                                    />
                                </RequirementSection>
                                <RequirementSection>
                                    <div style={{display: 'flex', marginTop: 'var(--grid-unit)', justifyContent: 'flex-end'}}>
                                        <Button disabled>Save</Button>
                                        <Button disabled style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}>Preserved this week</Button>
                                    </div>
                                </RequirementSection>
                            </RequirementContainer>
                        );
                    })
                }
            </div>
        );
    };

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
            {
                getRequirements()
            }
        </Container>
    );
};

export default Preservation; 