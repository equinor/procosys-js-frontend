import React from 'react';

import { Container, TagDetailsContainer, Details, GridFirstRow, GridSecondRow, RemarkContainer, RequirementContainer, RequirementSection, Field } from './Preservation.style';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { TagDetails, TagRequirement, TagRequirementField } from './../types';
import PreservationIcon from '../../../PreservationIcon';
import Checkbox from './../../../../../../components/Checkbox';
import Spinner from '../../../../../../components/Spinner';

interface PreservationProps {
    details: TagDetails | undefined;
    requirements: TagRequirement[] | undefined;
}

const Preservation = ({
    details,
    requirements
}: PreservationProps): JSX.Element => {

    const getNumberField = (field: TagRequirementField): JSX.Element => {
        let currentValue: string | number | null = '';
        if (field.currentValue) {
            currentValue = field.currentValue.isNA ? 'N/A' : field.currentValue.value;
        }

        let previousValue: string | number | null = '';
        if (field.previousValue) {
            previousValue = field.previousValue.isNA ? 'N/A' : field.previousValue.value;
        }

        return (
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <div style={{maxWidth: '25%'}}>
                    <TextField
                        id={`field${field.id}`}
                        label={field.label}
                        meta={`(${field.unit})`}
                        defaultValue={currentValue}
                    />
                </div>
                {
                    field.showPrevious &&
                    <div style={{maxWidth: '25%', marginLeft: 'calc(var(--grid-unit) * 3)'}}>
                        <TextField
                            id={`fieldPrevious${field.id}`}
                            label='Previous value'
                            meta={`(${field.unit})`}
                            defaultValue={previousValue}
                            disabled
                        />
                    </div>                            
                }
            </div>
        );
    };

    const getCheckboxField = (field: TagRequirementField): JSX.Element => {
        const isChecked = field.currentValue && field.currentValue.isChecked;

        return (
            <Checkbox checked={isChecked}>
                <Typography variant='body_long'>{field.label}</Typography>
            </Checkbox>
        );
    };

    const getRequirementField = (field: TagRequirementField): JSX.Element => {
        switch (field.fieldType.toLowerCase()) {
            case 'info':
                return <Typography variant='body_long'>{field.label}</Typography>;
            case 'checkbox':
                return getCheckboxField(field);
            case 'number':
                return getNumberField(field);
            default:
                return <div>Unknown field type</div>;
        }
    };

    const getRequirements = (): JSX.Element => {
        if (requirements === undefined) {
            return <div style={{margin: 'calc(var(--grid-unit) * 5) auto'}}><Spinner medium /></div>;
        }

        return (
            <div>
                {
                    // eslint-disable-next-line react/prop-types
                    requirements.map(requirement => {
                        return (
                            <RequirementContainer key={requirement.id}>
                                <RequirementSection>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Typography variant='h4'>
                                            {requirement.requirementTypeTitle}
                                        </Typography>
                                        <div style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}>
                                            <PreservationIcon variant={requirement.requirementTypeCode} />
                                        </div>
                                    </div>
                                    <Typography variant='h6'>
                                        {requirement.requirementDefinitionTitle}
                                    </Typography>                                    
                                    <div style={{display: 'flex', alignItems: 'baseline', marginTop: 'var(--grid-unit)'}}>
                                        <Typography variant='caption'>Interval</Typography>
                                        <Typography variant='body_short' bold style={{marginLeft: 'var(--grid-unit)'}}>{requirement.intervalWeeks}</Typography>
                                        <Typography variant='caption' style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}>Next</Typography>
                                        <Typography variant='body_short' bold style={{marginLeft: 'var(--grid-unit)'}}>{requirement.nextDueAsYearAndWeek}</Typography>
                                    </div>
                                </RequirementSection>
                                <RequirementSection>
                                    {
                                        requirement.fields.map(field => {
                                            return (
                                                <Field key={field.id}>
                                                    {
                                                        getRequirementField(field)
                                                    }
                                                </Field>
                                            );
                                        })
                                    }
                                </RequirementSection>
                                <RequirementSection>
                                    <TextField 
                                        id={`requirementComment${requirement.id}`}
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