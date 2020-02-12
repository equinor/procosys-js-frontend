import { Container, FormFieldSpacer, Next, Header, InputContainer } from './CreateAreaTag.style';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { Button } from '@equinor/eds-core-react';
import { TextField } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../../context/PreservationContext';
import { Tag, Discipline, Area } from '../types';


const areaTypes: SelectItem[] = [
    { text: 'Normal', value: '#PRE' },
    { text: 'Site', value: '#SITE' }];

type CreateAreaTagProps = {
    nextStep: () => void;
    setSelectedTags: (tags: Tag[]) => void;
    disciplines: Discipline[];

    areas: Area[];
    areaType: SelectItem | undefined;
    setAreaType: (areaType: SelectItem | undefined) => void;
    discipline: Discipline | undefined;
    setDiscipline: (discipline: Discipline | undefined) => void;
    area: Area | undefined;
    setArea: (area: Area | undefined) => void;
    freetext: string | undefined;
    setFreetext: (freetext: string | undefined) => void;
    description: string | undefined;
    setDescription: (description: string | undefined) => void;
}

const CreateAreaTag = (props: CreateAreaTagProps): JSX.Element => {
    const { project } = usePreservationContext();

    const [mappedDisciplines, setMappedDisciplines] = useState<SelectItem[]>([]);
    const [mappedAreas, setMappedAreas] = useState<SelectItem[]>([]);

    const freetextInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    //Build tagNo
    let newTagNo = '';
    if (props.areaType && props.discipline && props.description) {
        newTagNo = props.areaType.value + '-' + props.discipline.code;
        if (props.areaType.value === '#PRE' && props.area) {
            newTagNo = newTagNo + '-' + props.area.code;
        }
        props.freetext ? newTagNo = newTagNo + '-' + props.freetext : null;
    }

    /** Set initial values */
    useEffect(() => {
        freetextInputRef.current && props.freetext ? freetextInputRef.current.value = props.freetext : null;
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
                            {(props.areaType != undefined && props.areaType.text) || 'Select'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <FormFieldSpacer>
                        <SelectInput
                            onChange={setDisciplineForm}
                            data={mappedDisciplines}
                            label={'Discipline'}
                        >
                            {(props.discipline != undefined && props.discipline.description) || 'Select'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <FormFieldSpacer>
                        <SelectInput
                            onChange={setAreaForm}
                            data={mappedAreas}
                            label={'Area'}
                            hidden={props.areaType === undefined || props.areaType.value !== '#PRE'}
                        >
                            {(props.area != undefined && props.area.description) || 'Type to select'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <Next>
                        <Button onClick={nextStep} disabled={newTagNo === ''}>Next</Button>
                    </Next>
                </InputContainer>
            </Container >
            <InputContainer>
                <TextField
                    id={'Freetext'}
                    style={{ maxWidth: '200px' }}
                    label="Freetext for area tag (space not allowed)"
                    inputRef={freetextInputRef}
                    placeholder="Write Here"
                    helpertext="Free text part of the tagno."
                    onChange={(e: any): void => props.setFreetext(e.target.value)}
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
