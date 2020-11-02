import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { ButtonContainer, Container, DateTimeContainer, DropdownItem, FormContainer, LocationContainer, PoTypeContainer } from './GeneralInfo.style';
import { GeneralInfoDetails, ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import { Canceler } from '@procosys/http/HttpClient';
import DateFnsUtils from '@date-io/date-fns';
import Dropdown from '../../../../../components/Dropdown';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { set } from 'date-fns';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '../../../context/InvitationForPunchOutContext';

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
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                    <KeyboardDatePicker
                        label="Date"
                        value={generalInfo.startTime}
                        onChange={(date: MaterialUiPickersDate): void => { 
                            setGeneralInfo(gi => {
                                return {...gi, startTime: date as Date, endTime: date as Date};
                            }); 
                        }}
                        disablePast={false}
                        format='MM.dd.yyyy'
                        variant='inline'
                        inputVariant='outlined'
                        placeholder='MM.dd.yyyy'
                    />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                    <KeyboardTimePicker
                        label="From"
                        value={generalInfo.startTime}
                        onChange={(date: MaterialUiPickersDate): void => { 
                            const hours = (date as Date).getHours();
                            const minutes = (date as Date).getMinutes();
                            hours && minutes && setGeneralInfo(gi => {return {...gi, startTime: set(generalInfo.startTime, { hours, minutes}) }; }); 
                        }}
                        ampm={false}
                        variant='inline'
                        inputVariant='outlined'
                    />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                    <KeyboardTimePicker
                        label="To"
                        value={generalInfo.endTime}
                        onChange={(date: MaterialUiPickersDate): void => { 
                            const hours = (date as Date).getHours();
                            const minutes = (date as Date).getMinutes();
                            const newTime = set(generalInfo.endTime, { hours, minutes});
                            if (generalInfo.startTime <= newTime) {
                                setGeneralInfo(gi => {return {...gi, endTime: newTime }; }); 
                            } else {
                                showSnackbarNotification('End time must follow start time.');
                            }
                        }}
                        ampm={false}
                        variant='inline'
                        inputVariant='outlined'
                    />
                </MuiPickersUtilsProvider>
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
