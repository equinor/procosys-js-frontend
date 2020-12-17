import { Container, DateTimeContainer, DropdownItem, FormContainer, LocationContainer, PoTypeContainer } from './GeneralInfo.style';
import { GeneralInfoDetails, ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { TextField, Typography } from '@equinor/eds-core-react';
import { format, set } from 'date-fns';

import { Canceler } from '@procosys/http/HttpClient';
import { TextField as DateTimeField } from '@material-ui/core';
import Dropdown from '../../../../../components/Dropdown';
import { getEndTime } from '../utils';
import { useInvitationForPunchOutContext } from '../../../context/InvitationForPunchOutContext';

export const poTypes: SelectItem[] = [
    { text: 'DP (Discipline Punch)', value: 'DP' },
    { text: 'MDP (Multi Discipline Punch)', value: 'MDP' }];

interface GeneralInfoProps {
    generalInfo: GeneralInfoDetails;
    setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfoDetails>>;
    fromMain: boolean;
    clearScope: () => void;
}

const GeneralInfo = ({
    generalInfo,
    setGeneralInfo,
    fromMain,
    clearScope
}: GeneralInfoProps): JSX.Element => {
    const { apiClient } = useInvitationForPunchOutContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [errorFormat, setErrorFormat] = useState<boolean>(false);

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
    }, []);

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
        if (!fromMain) {
            clearScope();
        }
        const newPoType = poTypes.find((p: SelectItem) => p.value === value);
        if (newPoType) {
            setGeneralInfo(gi => { return { ...gi, poType: newPoType }; });
        }
    };

    const setProjectForm = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        if (generalInfo.projectId !== filteredProjects[index].id) clearScope();
        setGeneralInfo(gi => { return { ...gi, projectId: filteredProjects[index].id, projectName: filteredProjects[index].name }; });
    };

    const selectedProject = availableProjects.find(p => p.id == generalInfo.projectId);

    useEffect(() => {
        if (selectedProject) {
            setGeneralInfo(gi => { return { ...gi, projectName: selectedProject.name }; });
        }
    }, [selectedProject]);

    const handleSetDate = (dateString: string): void => {
        const date = new Date(dateString);
        const newStart = set(generalInfo.startTime, { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() });
        const newEnd = set(generalInfo.endTime, { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() });
        setGeneralInfo(gi => { return { ...gi, startTime: newStart, endTime: newEnd }; });
    };

    const handleSetTime = (from: 'start' | 'end', timeString: string): void => {
        const timeSplit = timeString.split(':');
        if (timeSplit[0] && timeSplit[1]) {
            if (from === 'start') {
                const newTime = set(generalInfo.startTime, { hours: Number(timeSplit[0]), minutes: Number(timeSplit[1]) });
                const newEndTime = newTime > generalInfo.endTime ? getEndTime(newTime) : generalInfo.endTime;
                setGeneralInfo(gi => { return { ...gi, startTime: newTime, endTime: newEndTime }; });
                setErrorFormat(newTime >= newEndTime);
            } else {
                const newEndTime = set(generalInfo.endTime, { hours: Number(timeSplit[0]), minutes: Number(timeSplit[1]) });
                setGeneralInfo(gi => { return { ...gi, endTime: newEndTime }; });
                setErrorFormat(generalInfo.startTime >= newEndTime);
            }
        }
    };

    return (<Container>
        <FormContainer>
            <Dropdown
                label={'Project'}
                maxHeight='300px'
                variant='form'
                text={selectedProject && selectedProject.description || generalInfo.projectName || 'Select'}
                onFilter={setFilterForProjects}
                disabled={fromMain}
            >
                {filteredProjects.map((projectItem, index) => {
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
            <PoTypeContainer data-testid='po-type-select'>
                <SelectInput
                    onChange={setPoTypeForm}
                    data={poTypes}
                    label={'Type of punch round'}
                >
                    {(generalInfo.poType && generalInfo.poType.text) || 'Select'}
                </SelectInput>
            </PoTypeContainer>
            <TextField
                data-testid='title'
                id={'title'}
                label='Title'
                placeholder='Write here'
                defaultValue={generalInfo.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setGeneralInfo(gi => { return { ...gi, title: e.target.value }; });
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
                    setGeneralInfo(gi => { return { ...gi, description: e.target.value }; });
                }}
            />
            <Typography constiant='h5'>Date and time for punch round</Typography>
            <DateTimeContainer>
                <DateTimeField
                    id='startDate'
                    label='Date'
                    type='date'
                    value={format(generalInfo.startTime, 'yyyy-MM-dd')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => handleSetDate(event.target.value)}
                />
                <DateTimeField
                    id='startTime'
                    label='From'
                    type='time'
                    onClick={(e: React.MouseEvent<HTMLDivElement>): void => e.preventDefault()}
                    value={format(generalInfo.startTime, 'HH:mm')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => handleSetTime('start', event.target.value)}
                />
                <DateTimeField
                    id='endDate'
                    label='To'
                    type='time'
                    onClick={(e: React.MouseEvent<HTMLDivElement>): void => e.preventDefault()}
                    value={format(generalInfo.endTime, 'HH:mm')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => handleSetTime('end', event.target.value)}
                    error={errorFormat}
                />
            </DateTimeContainer>
            <LocationContainer>
                <TextField
                    data-testid='location'
                    id='location'
                    placeholder='Write here'
                    label='Location'
                    meta='Optional'
                    defaultValue={generalInfo.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setGeneralInfo(gi => { return { ...gi, location: e.target.value }; });
                    }}
                />
            </LocationContainer>
        </FormContainer>
    </Container>);
};

export default GeneralInfo;
