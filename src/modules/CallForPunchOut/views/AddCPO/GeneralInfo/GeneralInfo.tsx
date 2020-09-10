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
    generalInfo: GeneralInfoDetails;
    setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfoDetails>>;
    fromMain: boolean;
    next: () => void;
    isValid: boolean;
    clearScope: () => void;
}

const GeneralInfo = ({
    generalInfo,
    setGeneralInfo,
    fromMain,
    next,
    isValid,
    clearScope
}: GeneralInfoProps): JSX.Element => {
    const { procosysApiClient } = useProcosysContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [filterForProjects, setFilterForProjects] = useState<string>('');   

    useEffect(() => {
        let requestCanceler: Canceler;
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
            setPoTypeForm('DP');
        }
    }, [fromMain]);

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
        clearScope();
        const newPoType = poTypes.find((p: SelectItem) => p.value === value);
        if (newPoType) {
            setGeneralInfo(gi => {return {...gi, poType: newPoType};});
        }
    };

    const setProjectForm = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setGeneralInfo(gi => {return {...gi, projectId: filteredProjects[index].id};});
    };

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
                defaultValue={generalInfo.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setGeneralInfo(gi => {return {...gi, title: e.target.value};}); 
                }}
            />
            <TextField
                id='description'
                placeholder='Write here'
                label='Description'
                meta='Optional'
                defaultValue={generalInfo.description}
                multiline
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                    setGeneralInfo(gi => {return {...gi, description: e.target.value};}); 
                }}
            />
            <Typography constiant='h5'>Date and time for punch round</Typography>
            <DateTimeContainer>
                <DateTimeField
                    id='startDate'
                    label='From'
                    type='date'
                    defaultValue={generalInfo.startDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {return {...gi, startDate: e.target.value};}); 
                    }}
                />
                <DateTimeField
                    id='time'
                    label='Time'
                    type='time'
                    defaultValue={generalInfo.startTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {return {...gi, startTime: e.target.value};}); 
                    }}
                />
                <DateTimeField
                    id='endDate'
                    label='To'
                    type='date'
                    defaultValue={generalInfo.endDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {return {...gi, endDate: e.target.value};}); 
                    }}
                />
                <DateTimeField
                    id='time'
                    label='Time'
                    type='time'
                    defaultValue={generalInfo.endTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {return {...gi, endTime: e.target.value};}); 
                    }}
                />
            </DateTimeContainer>
            <LocationContainer>
                <TextField
                    id='location'
                    placeholder='Write here'
                    label='Location'
                    meta='Optional'
                    defaultValue={generalInfo.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {return {...gi, location: e.target.value};}); 
                    }}
                />
            </LocationContainer>   
        </FormContainer>
        <ButtonContainer>
            <Button constiant='outlined' disabled>Previous</Button>
            <Button 
                disabled={!isValid} 
                onClick={next}
            >
                Next
            </Button>
        </ButtonContainer>
    </Container>);
};

export default GeneralInfo;
