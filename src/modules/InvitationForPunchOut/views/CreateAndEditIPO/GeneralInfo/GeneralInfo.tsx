import { ConfirmCheckbox, ConfirmationTextContainer, Container, DateTimeContainer, DropdownItem, FormContainer, LocationContainer, PoTypeContainer, TextContainer } from './GeneralInfo.style';
import { GeneralInfoDetails, ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { TextField, Typography } from '@equinor/eds-core-react';
import { format, set } from 'date-fns';

import { Canceler } from '@procosys/http/HttpClient';
import { TextField as DateTimeField } from '@material-ui/core';
import Dropdown from '../../../../../components/Dropdown';
import Spinner from '@procosys/components/Spinner';
import { getEndTime } from '../utils';
import { useInvitationForPunchOutContext } from '../../../context/InvitationForPunchOutContext';

export const poTypes: SelectItem[] = [
    { text: 'DP (Discipline Punch)', value: 'DP' },
    { text: 'MDP (Multi Discipline Punch)', value: 'MDP' }];

interface GeneralInfoProps {
    generalInfo: GeneralInfoDetails;
    setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfoDetails>>;
    fromMain: boolean;
    isEditMode: boolean;
    clearScope: () => void;
    confirmationChecked: boolean;
    setConfirmationChecked: React.Dispatch<React.SetStateAction<boolean>>
}

const GeneralInfo = ({
    generalInfo,
    setGeneralInfo,
    fromMain,
    isEditMode,
    clearScope,
    confirmationChecked,
    setConfirmationChecked
}: GeneralInfoProps): JSX.Element => {
    const { apiClient } = useInvitationForPunchOutContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [timeError, setTimeError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let requestCanceler: Canceler;
        (async (): Promise<void> => {
            try {
                setIsLoading(true);
                const allProjects = await apiClient.getAllProjectsForUserAsync((cancelerCallback) => requestCanceler = cancelerCallback);
                setAvailableProjects(allProjects);
                setFilteredProjects(allProjects);
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
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
        if (generalInfo.projectName !== filteredProjects[index].name) clearScope();
        setGeneralInfo(gi => { return { ...gi, projectName: filteredProjects[index].name }; });
    };

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
                setTimeError(newTime >= newEndTime);
            } else {
                const newEndTime = set(generalInfo.endTime, { hours: Number(timeSplit[0]), minutes: Number(timeSplit[1]) });
                setGeneralInfo(gi => { return { ...gi, endTime: newEndTime }; });
                setTimeError(generalInfo.startTime >= newEndTime);
            }
        }
    };

    return (<Container>
        <FormContainer>
            <Dropdown
                label={'Project'}
                maxHeight='300px'
                variant='form'
                text={generalInfo.projectName || 'Select'}
                onFilter={setFilterForProjects}
                disabled={fromMain || isEditMode}
            >
                {isLoading && <div style={{ margin: 'calc(var(--grid-unit))' }} ><Spinner medium /></div>}
                {!isLoading &&
                    filteredProjects.map((projectItem, index) => {
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
                    })
                }
            </Dropdown>
            <PoTypeContainer id='po-type-select'>
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
                    label='Start'
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
                    label='End'
                    type='time'
                    onClick={(e: React.MouseEvent<HTMLDivElement>): void => e.preventDefault()}
                    value={format(generalInfo.endTime, 'HH:mm')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => handleSetTime('end', event.target.value)}
                />
                {timeError &&
                    (<Typography variant="caption" color="danger">Start time must be before end time</Typography>)
                }
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
            <ConfirmationTextContainer>
                {isEditMode ? <ConfirmCheckbox disabled checked /> : <ConfirmCheckbox checked={confirmationChecked} onChange={(): void => setConfirmationChecked(confirmed => !confirmed)} />}
                <TextContainer>
                    <Typography variant="body_short" fontWeight={400}>
                        I hereby confirm that prior to common punch out all relevant MCCR shall be signed and all punch items registered.
                    </Typography>
                    <br />
                    <Typography variant="body_short" fontWeight={400}>
                        Mechanical Completion means that the installation is built in accordance with relevant drawings and specifications.
                        All specified tests and inspections are carried out and documented in a uniform way.
                    </Typography>
                </TextContainer>
            </ConfirmationTextContainer>
        </FormContainer>
    </Container>);
};

export default GeneralInfo;
