import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Dropdown from '../../../../../components/Dropdown';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { DropdownItem, DateTimeContainer, Container, PoTypeContainer, LocationContainer, FormContainer, ButtonContainer } from './GeneralInfo.style';
import { ProjectDetails, GeneralInfoDetails } from '@procosys/modules/CallForPunchOut/types';
import { TextField as DateTimeField } from '@material-ui/core';
import { useProcosysContext } from '@procosys/core/ProcosysContext';
import { Canceler } from '@procosys/http/HttpClient';

const poTypes: SelectItem[] = [
    { text: 'DP (Discipline Punch)', value: 'DP' },
    { text: 'MDP (Multi Discipline Punch)', value: 'MDP' }];

interface GeneralInfoProps {
    generalInfoDetails: GeneralInfoDetails;
    setGeneralInfoDetails: (generalInfoDetails: GeneralInfoDetails) => void;
    fromMain: boolean;
}

const GeneralInfo = ({
    generalInfoDetails,
    setGeneralInfoDetails,
    fromMain
}: GeneralInfoProps): JSX.Element => {
    const { procosysApiClient } = useProcosysContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [isValidForm, setIsValidForm] = useState<boolean>(false);
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(generalInfoDetails);

    let requestCanceler: Canceler;
    useEffect(() => {
        (async (): Promise<void> => {
            const allProjects = await procosysApiClient.getAllProjectsForUserAsync((cancelerCallback) => requestCanceler = cancelerCallback)
                .then(projects => projects.map((project): ProjectDetails => {
                    return {
                        id: project.id,
                        name: project.name,
                        description: project.description
                    };
                }));
            setAvailableProjects(allProjects);
            setFilteredProjects(allProjects);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[]);

    useEffect(() => {
        if(fromMain) {
            const poType = poTypes.find((p: SelectItem) => p.value === 'DP');
            if (poType) {
                setGeneralInfo(gi => {
                    const copy = Object.assign({}, gi);
                    copy.poType = poType;
                    return copy;
                });
            }
        }
    });

    useEffect(() => {
        if (filterForProjects.length <= 0) {
            setFilteredProjects(availableProjects);
            return;
        }

        setFilteredProjects(availableProjects.filter((p: ProjectDetails) => {
            return p.name.toLowerCase().indexOf(filterForProjects.toLowerCase()) > -1 ||
                p.description.toLowerCase().indexOf(filterForProjects.toLowerCase()) > -1;
        }));
    }, [filterForProjects]);

    const setPoTypeForm = (value: string): void => {
        const newPoType = poTypes.find((p: SelectItem) => p.value === value);
        if (newPoType) {
            setGeneralInfo(gi => {
                const copy = Object.assign({}, gi);
                copy.poType = newPoType;
                return copy;
            });
        }
    };

    const setProjectForm = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setGeneralInfo(gi => {
            const copy = Object.assign({}, gi);
            copy.projectId = filteredProjects[index].id;
            return copy;
        });
    };

    useEffect(() => {
        if (generalInfo.poType && generalInfo.projectId && generalInfo.title && generalInfo.startDate && generalInfo.startTime && generalInfo.endDate && generalInfo.endTime) {
            setIsValidForm(true);
        } else {
            setIsValidForm(false);
        }
    }), [generalInfo];

    const selectedProject = availableProjects.find(p => p.id == generalInfo.projectId);

    return (<Container>
        <FormContainer>
            <Dropdown
                label={'Project'}
                maxHeight='300px'
                variant='form'
                text={selectedProject && selectedProject.description || 'Select'}
                onFilter={setFilterForProjects}
                disabled={fromMain}
            >
                { filteredProjects.map((projectItem, index) => {
                    return (
                        <DropdownItem
                            key={index}
                            onClick={(event): void =>
                                setProjectForm(event, index)
                            }
                        >
                            <div>{projectItem.description}</div>
                            <div style={{ fontSize: '12px' }}>{projectItem.name}</div>
                        </DropdownItem>
                    );
                })}
            </Dropdown>
            <PoTypeContainer>
                <SelectInput
                    onChange={setPoTypeForm}
                    data={poTypes}
                    label={'Type of punch round'}
                    disabled={fromMain}
                >
                    {(generalInfo.poType && generalInfo.poType.text) || 'Select'}
                </SelectInput>
            </PoTypeContainer>
            <TextField
                id={'title'}
                label='Title'
                placeholder='Write here'
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                    setGeneralInfo(gi => {
                        const copy = Object.assign({}, gi);
                        copy.title = e.target.value;
                        return copy;
                    }); 
                }}
            />
            <TextField
                id='description'
                placeholder='Write here'
                label='Description'
                meta='Optional'
                multiline
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                    setGeneralInfo(gi => {
                        const copy = Object.assign({}, gi);
                        copy.description = e.target.value;
                        return copy;
                    }); 
                }}
            />
            <Typography variant='h5'>Date and time for punch round</Typography>
            <DateTimeContainer>
                <DateTimeField
                    id='startDate'
                    label='From'
                    type='date'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {
                            const copy = Object.assign({}, gi);
                            copy.startDate = e.target.value;
                            return copy;
                        }); 
                    }}
                />
                <DateTimeField
                    id='time'
                    label='Time'
                    type='time'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {
                            const copy = Object.assign({}, gi);
                            copy.startTime = e.target.value;
                            return copy;
                        }); 
                    }}
                />
                <DateTimeField
                    id='endDate'
                    label='To'
                    type='date'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {
                            const copy = Object.assign({}, gi);
                            copy.endDate = e.target.value;
                            return copy;
                        }); 
                    }}
                />
                <DateTimeField
                    id='time'
                    label='Time'
                    type='time'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {
                            const copy = Object.assign({}, gi);
                            copy.endTime = e.target.value;
                            return copy;
                        }); 
                    }}
                />
            </DateTimeContainer>
            <LocationContainer>
                <TextField
                    id='location'
                    placeholder='Write here'
                    label='Location'
                    meta='Optional'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {
                            const copy = Object.assign({}, gi);
                            copy.location = e.target.value;
                            return copy;
                        }); 
                    }}
                />
            </LocationContainer>   
        </FormContainer>
        <ButtonContainer>
            <Button variant='outlined' disabled>Previous</Button>
            <Button 
                disabled={!isValidForm}
                onClick={setGeneralInfoDetails(generalInfo)}
            >
                Next
            </Button>
        </ButtonContainer>
    </Container>);
};

export default GeneralInfo;
