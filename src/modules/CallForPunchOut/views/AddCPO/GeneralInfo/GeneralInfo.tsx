import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Dropdown from '../../../../../components/Dropdown';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { DropdownItem, DateTimeContainer, Container, PoTypeContainer, LocationContainer, FormContainer, ButtonContainer } from './GeneralInfo.style';
import { useCallForPunchOutContext } from '@procosys/modules/CallForPunchOut/context/CallForPunchOutContext';
import { ProjectDetails } from '@procosys/modules/CallForPunchOut/types';
import { TextField as DateTimeField } from '@material-ui/core';


const poTypes: SelectItem[] = [
    { text: 'DP (Discipline Punch)', value: 'DP' },
    { text: 'MDP (Multi Discipline Punch)', value: 'MDP' }];

type GeneralInfoProps = {
    setPoType: (poType?: SelectItem) => void;
    setDescription: (description?: string) => void;
    setTitle: (title: string) => void;
    setProjectId: (id: number) => void;
    setLocation: (location: string) => void;
    setStartDate: (startDate: string | null) => void;
    setEndDate: (endDate: string | null) => void;
    setStartTime: (startTime: string | null) => void;
    setEndTime: (endTime: string | null) => void;
    poType?: SelectItem;
    description?: string | null;
    fromMain: boolean;
    title?: string;
    projectId?: number;
    location?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
}

const GeneralInfo = (props: GeneralInfoProps): JSX.Element => {
    const {availableProjects} = useCallForPunchOutContext();
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>(availableProjects);
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [isValidForm, setIsValidForm] = useState<boolean>(false);


    useEffect(() => {
        if(props.fromMain) {
            props.setPoType(poTypes.find((p: SelectItem) => p.value === 'DP'));
            if(props.projectId) {
                props.setProjectId(props.projectId);
            }
        }
    });

    useEffect(() => {
        setFilteredProjects(availableProjects);
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
        props.setPoType(newPoType);
    };

    const setProjectForm = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        props.setProjectId(filteredProjects[index].id);
    };

    const selectedProject = availableProjects.find(p => p.id == props.projectId);

    useEffect(() => {
        if (props.poType && props.projectId && props.title && props.startDate && props.startTime && props.endDate && props.endTime) {
            setIsValidForm(true);
        } else {
            setIsValidForm(false);
        }
    }), [props.poType, props.projectId, props.title, props.startDate, props.startTime, props.endDate, props.endTime];


    return (<Container>
        <FormContainer>
            <Dropdown
                label={'Project'}
                maxHeight='300px'
                variant='form'
                text={selectedProject && selectedProject.description || 'Select'}
                onFilter={setFilterForProjects}
                disabled={props.fromMain}
            >
                {filteredProjects.map((projectItem, index) => {
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
                    disabled={props.fromMain}
                >
                    {(props.poType && props.poType.text) || 'Select'}
                </SelectInput>
            </PoTypeContainer>
            <TextField
                id={'title'}
                label='Title'
                placeholder='Write here'
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { props.setTitle(e.target.value); }}
            />
            <TextField
                id='description'
                placeholder='Write here'
                label='Description'
                meta='Optional'
                multiline
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.setStartDate(e.target.value)}

                />
                <DateTimeField
                    id='time'
                    label='Time'
                    type='time'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.setStartTime(e.target.value)}
                />
                <DateTimeField
                    id='endDate'
                    label='To'
                    type='date'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.setEndDate(e.target.value)}
                />
                <DateTimeField
                    id='time'
                    label='Time'
                    type='time'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.setEndTime(e.target.value)}
                />
            </DateTimeContainer>
            <LocationContainer>
                <TextField
                    id='location'
                    placeholder='Write here'
                    label='Location'
                    meta='Optional'
                />
            </LocationContainer>   
        </FormContainer>
        <ButtonContainer>
            <Button variant='outlined' disabled>Previous</Button>
            <Button disabled={!isValidForm}>Next</Button>
        </ButtonContainer>
    </Container>);
};

export default GeneralInfo;
