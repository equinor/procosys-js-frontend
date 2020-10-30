import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { ButtonContainer, Container, DateTimeContainer, DropdownItem, FormContainer, LocationContainer, PoTypeContainer } from './GeneralInfo.style';
import { GeneralInfoDetails, ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import { Canceler } from '@procosys/http/HttpClient';
import { TextField as DateTimeField } from '@material-ui/core';
import Dropdown from '../../../../../components/Dropdown';
import { useInvitationForPunchOutContext } from '../../../context/InvitationForPunchOutContext';

const TIME_START = '08:00';
const TIME_END = '08:30';

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
    const { apiClient } = useInvitationForPunchOutContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [filterForProjects, setFilterForProjects] = useState<string>('');   

    useEffect(() => {
        let requestCanceler: Canceler;
        (async (): Promise<void> => {
            const allProjects = await apiClient.getAllProjectsForUserAsync((cancelerCallback) => requestCanceler = cancelerCallback)
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
        if(!fromMain) {
            clearScope();
        }
        const newPoType = poTypes.find((p: SelectItem) => p.value === value);
        if (newPoType) {
            setGeneralInfo(gi => {return {...gi, poType: newPoType};});
        }
    };

    const setProjectForm = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setGeneralInfo(gi => {return {...gi, projectId: filteredProjects[index].id, projectName: filteredProjects[index].name};});
    };

    const selectedProject = availableProjects.find(p => p.id == generalInfo.projectId);

    useEffect(() => {
        if (selectedProject) {
            setGeneralInfo(gi => {return {...gi, projectName: selectedProject.name};});
        }
    }, [selectedProject]);



    const formatDate = (date: Date, format: string): string => {
        const map = {
            mm: date.getMonth() + 1,
            dd: date.getDate(),
            yyyy: date.getFullYear()
        };
        return format.replace(/mm|dd|yyyy/gi, matched => (map as any)[matched]);
    };

    useEffect(() => {
        if (!generalInfo.startDate || !generalInfo.startTime ||
            !generalInfo.endDate || !generalInfo.endTime) {
            const now = formatDate(new Date(), 'yyyy-mm-dd');
            setGeneralInfo(gi => { return { ...gi, startDate: now, endDate: now, startTime: TIME_START, endTime: TIME_END }; });
        }
    }, []);

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
                            onClick={(event: React.MouseEvent): void =>
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
                    label='Date'
                    type='date'
                    defaultValue={generalInfo.startDate ? generalInfo.startDate : formatDate(new Date(), 'yyyy-mm-dd')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {return {...gi, startDate: e.target.value, endDate: e.target.value};}); 
                    }}
                />
                <DateTimeField
                    id='time'
                    label='From'
                    type='time'
                    defaultValue={generalInfo.startTime ? generalInfo.startTime : TIME_START}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { 
                        setGeneralInfo(gi => {return {...gi, startTime: e.target.value};}); 
                    }}
                />
                <DateTimeField
                    id='time'
                    label='To'
                    type='time'
                    defaultValue={generalInfo.endTime ? generalInfo.endTime : TIME_END}
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
