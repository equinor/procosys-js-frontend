import { Container, FormFieldSpacer, Next, Header, InputContainer } from './CreateAreaTag.style';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { Button } from '@equinor/eds-core-react';
import { TextField } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../../context/PreservationContext';
import { Tag, Discipline, Area } from '../types';


export const areaTypes: SelectItem[] = [
    { text: 'Normal', value: 'PreArea' },
    { text: 'Site', value: 'SiteArea' }];

type CreateAreaTagProps = {
    nextStep: () => void;
    setSelectedTags: (tags: Tag[]) => void;
    setAreaType: (areaType?: SelectItem) => void;
    setDiscipline: (discipline?: Discipline) => void;
    setArea: (area?: Area) => void;
    setDescription: (description?: string) => void;
    setSuffix: (suffix: string) => void;
    disciplines: Discipline[];
    areas: Area[];
    areaType?: SelectItem;
    discipline?: Discipline;
    area?: Area;
    suffix?: string;
    description?: string;
}

const CreateAreaTag = (props: CreateAreaTagProps): JSX.Element => {
    const { project } = usePreservationContext();

    const [mappedDisciplines, setMappedDisciplines] = useState<SelectItem[]>([]);
    const [mappedAreas, setMappedAreas] = useState<SelectItem[]>([]);

    const suffixInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    //Build tagNo
    let newTagNo = '';
    if (props.areaType && props.discipline && props.description) {
        newTagNo = `${props.areaType.value}-${props.discipline.code}`;
        if (props.areaType.value === '#PRE' && props.area) {
            newTagNo = `${newTagNo}-${props.area.code}`;
        }
        props.suffix ? newTagNo = `${newTagNo}-${props.suffix}` : null;
    }

    /** Set initial values */
    useEffect(() => {
        suffixInputRef.current && props.suffix ? suffixInputRef.current.value = props.suffix : null;
        descriptionInputRef.current && props.description ? descriptionInputRef.current.value = props.description : null;
    }, []);

    /** Map disciplines into select elements */
    useEffect(() => {
        const mapped = props.disciplines.map((itm: Discipline) => {
            return {
                text: itm.description,
                value: itm.code
            };
        });
        setMappedDisciplines(mapped);
    }, [props.disciplines]);

    /** Map areas into select elements */
    useEffect(() => {
        const mapped = props.areas.map((itm: Area) => {
            return {
                text: itm.description,
                value: itm.code
            };
        });
        setMappedAreas(mapped);
    }, [props.areas]);

    const setAreaTypeForm = (value: string): void => {
        props.setAreaType(areaTypes.find((p: SelectItem) => p.value === value));
    };

    const setDisciplineForm = (value: string): void => {
        props.setDiscipline(props.disciplines.find((p: Discipline) => p.code === value));
    };

    const setAreaForm = (value: string): void => {
        props.setArea(props.areas.find((p: Area) => p.code === value));
    };

    const nextStep = (): void => {
        const tag: Tag = {
            tagNo: newTagNo,
            description: props.description || '',
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
                            {(props.areaType != undefined && props.areaType.text) || 'Select area type'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <FormFieldSpacer>
                        <SelectInput
                            onChange={setDisciplineForm}
                            data={mappedDisciplines}
                            label={'Discipline'}
                        >
                            {(props.discipline != undefined && props.discipline.description) || 'Select discipline'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <FormFieldSpacer>
                        {(props.areaType !== undefined && props.areaType.value === '#PRE') &&
                            <SelectInput
                                onChange={setAreaForm}
                                data={mappedAreas}
                                label={'Area'}
                            >
                                {(props.area != undefined && props.area.description) || 'Select area'}
                            </SelectInput>}
                    </FormFieldSpacer>
                    <Next>
                        <Button onClick={nextStep} disabled={newTagNo === ''}>Next</Button>
                    </Next>
                </InputContainer>
            </Container >
            <InputContainer>
                <TextField
                    id={'Suffix'}
                    style={{ maxWidth: '200px' }}
                    label="Tag number suffix (space not allowed)"
                    inputRef={suffixInputRef}
                    placeholder="Write Here"
                    helpertext="Text added to the end of the tagno."
                    onChange={(e: any): void => props.setSuffix(e.target.value)}
                />
            </InputContainer>
            <InputContainer>
                <TextField
                    id={'Description'}
                    style={{ maxWidth: '350px' }}
                    label="Description"
                    inputRef={descriptionInputRef}
                    multiline={true}
                    placeholder="Write Here"
                    helpertext="Description of the area tag."
                    onChange={(e: any): void => props.setDescription(e.target.value)}
                />
            </InputContainer>
        </div >
    );
};

export default CreateAreaTag;
