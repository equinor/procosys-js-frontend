import { Container, FormFieldSpacer, Next, Header, InputContainer } from './CreateAreaTag.style';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import { Button } from '@equinor/eds-core-react';
import { TextField } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../../context/PreservationContext';
import { Canceler } from 'axios';
import { Tag } from '../types';

export interface Discipline {
    code: string;
    description: string;
}

export interface Area {
    code: string;
    description: string;
}

const areaTypes: SelectItem[] = [
    { text: 'Normal', value: '#PRE' },
    { text: 'Site', value: '#SITE' }];

type CreateAreaTagProps = {
    //submitForm: (areaType: string, dicipline: Dicipline, Area: Area, titleText: string, description: string) => Promise<void>;
    nextStep: () => void;
    setSelectedTags: (tags: Tag[]) => void;
    //Diciplines: Dicipline[];
    //Area: Area[];
}

const CreateAreaTag = (props: CreateAreaTagProps): JSX.Element => {
    const { apiClient, project } = usePreservationContext();

    const [areaType, setAreaType] = useState<SelectItem>();

    const [discipline, setDiscipline] = useState<Discipline>();
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [mappedDisciplines, setMappedDisciplines] = useState<SelectItem[]>([]);

    const [area, setArea] = useState<Area>();
    const [areas, setAreas] = useState<Area[]>([]);
    const [mappedAreas, setMappedAreas] = useState<SelectItem[]>([]);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    const [description, setDescription] = useState<string>();
    const [title, setTitle] = useState<string>();


    //Build tag title
    let newTagNo = '';
    if (areaType && discipline && description) {
        newTagNo = areaType.value + '-' + discipline.code;
        if (areaType.value === '#PRE' && area) {
            newTagNo = newTagNo + '-' + area.code;
        }
        title ? newTagNo = newTagNo + '-' + title : null;
    }

    /** Get disciplines from api */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            const data = await apiClient.getDisciplines((cancel: Canceler) => requestCancellor = cancel);
            setDisciplines(data);
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /** Map disciplines into select elements */
    useEffect(() => {
        const mapped = disciplines.map((itm: Discipline) => {
            return {
                text: itm.description,
                value: itm.code
            };
        });
        setMappedDisciplines(mapped);
    }, [disciplines]);

    /** Get areas from api */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            const data = await apiClient.getAreas((cancel: Canceler) => requestCancellor = cancel);
            setAreas(data);
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /** Map areas into select elements */
    useEffect(() => {
        const mapped = areas.map((itm: Area) => {
            return {
                text: itm.description,
                value: itm.code
            };
        });
        setMappedAreas(mapped);
    }, [areas]);

    const setAreaTypeForm = (value: string): void => {
        setAreaType(areaTypes.find((p: SelectItem) => p.value === value));
    };

    const setDisciplineForm = (value: string): void => {
        console.log('skla sette dis: ' + value);
        setDiscipline(disciplines.find((p: Discipline) => p.code === value));
    };

    const setAreaForm = (value: string): void => {
        console.log('skla sette area: ' + value);
        setArea(areas.find((p: Area) => p.code === value));
    };

    const nextStep = (): void => {
        const tag: Tag = {
            tagNo: newTagNo,
            description: description || '',
        };
        props.setSelectedTags([tag]);
        props.nextStep();
    };

    return (
        <div>
            <Header>
                <h1>Create Area Tag</h1>
                <div>{project.description}</div>
            </Header>
            <Container>
                <InputContainer>
                    <FormFieldSpacer>
                        <SelectInput
                            onChange={setAreaTypeForm}
                            data={areaTypes}
                            label={'Area type'}
                        >
                            {(areaType != undefined && areaType.text) || 'Select'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <FormFieldSpacer>
                        <SelectInput
                            onChange={setDisciplineForm}
                            data={mappedDisciplines}
                            label={'Discipline'}
                        >
                            {(discipline != undefined && discipline.description) || 'Select'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <FormFieldSpacer>
                        <SelectInput
                            onChange={setAreaForm}
                            data={mappedAreas}
                            label={'Area'}
                            hidden={areaType === undefined || areaType.value !== '#PRE'}
                        >
                            {(area != undefined && area.description) || 'TODO: Type to select'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <Next>
                        <Button onClick={nextStep} disabled={newTagNo === ''}>Next</Button>
                    </Next>
                </InputContainer>
            </Container >
            <InputContainer>
                <TextField
                    id={'Title'}
                    style={{ maxWidth: '270px' }}
                    label="Title for area tag"
                    inputRef={titleInputRef}
                    placeholder="Write Here"
                    helpertext="Free text part of the tagno."
                    onChange={(e: any): void => setTitle(e.target.value)}
                />
            </InputContainer>
            <InputContainer>
                <TextField
                    id={'Description'}
                    style={{ maxWidth: '600px' }}
                    label="Description"
                    inputRef={descriptionInputRef}
                    placeholder="Write Here"
                    helpertext="Description of the area tag."
                    onChange={(e: any): void => setDescription(e.target.value)}
                />
            </InputContainer>
        </div >
    );
};

export default CreateAreaTag;
