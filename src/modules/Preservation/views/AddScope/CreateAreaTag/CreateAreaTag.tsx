import { Container, FormFieldSpacer, Next, Header, InputContainer, DropdownItem, CenterContent } from './CreateAreaTag.style';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { Button } from '@equinor/eds-core-react';
import { TextField } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../../context/PreservationContext';
import { Tag, Discipline, Area } from '../types';
import { Canceler } from 'axios';
import { showSnackbarNotification } from './../../../../../core/services/NotificationService';
import Dropdown from '../../../../../components/Dropdown';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Tooltip } from '@material-ui/core';
import Spinner from '../../../../../components/Spinner';

const areaTypes: SelectItem[] = [
    { text: 'Normal', value: 'PreArea' },
    { text: 'Site', value: 'SiteArea' }];

type AreaItem = {
    text: string;
    value: string;
};

type CreateAreaTagProps = {
    nextStep: () => void;
    setSelectedTags: (tags: Tag[]) => void;
    setAreaType: (areaType?: SelectItem) => void;
    setDiscipline: (discipline?: Discipline) => void;
    setArea: (area?: Area) => void;
    setDescription: (description?: string) => void;
    setSuffix: (suffix: string) => void;
    areaType?: SelectItem;
    discipline?: Discipline;
    area?: Area;
    suffix?: string;
    description?: string;
}

const CreateAreaTag = (props: CreateAreaTagProps): JSX.Element => {
    const { apiClient, project } = usePreservationContext();

    const [mappedDisciplines, setMappedDisciplines] = useState<SelectItem[]>([]);
    const suffixInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);

    const [filterForAreas, setFilterForAreas] = useState<string>('');
    const [allAreas, setAllAreas] = useState<AreaItem[]>([]);
    const [filteredAreas, setFilteredAreas] = useState<AreaItem[]>(allAreas);

    const [requiredFieldsFilled, setRequiredFieldsFilled] = useState<boolean>(false);
    const [tagNoValid, setTagNoValid] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    /** Load areas */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const response = await apiClient.getAreas((cancel: Canceler) => { requestCancellor = cancel; });
                const areas = response.map(area => ({
                    text: area.code + ' - ' + area.description,
                    value: area.code,
                }));
                setAllAreas(areas);
            } catch (error) {
                console.error('Get areas failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /** Set new area value */
    const changeArea = (event: React.MouseEvent, areaIndex: number): void => {
        event.preventDefault();
        const newArea = {
            code: filteredAreas[areaIndex].value,
            description: filteredAreas[areaIndex].text
        } as Area;
        props.setArea(newArea);
    };

    /** Update list of areas based on filter */
    useEffect(() => {
        if (filterForAreas.length <= 0) {
            setFilteredAreas(allAreas);
            return;
        }
        setFilteredAreas(allAreas.filter(p => p.text?.toLowerCase().indexOf(filterForAreas.toLowerCase()) > -1));
    }, [filterForAreas, allAreas]);

    /** Get disciplines from api */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await apiClient.getDisciplines((cancel: Canceler) => requestCancellor = cancel);

                setDisciplines(data);
            } catch (error) {
                console.error('Get Disciplines failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    //Build tagNo
    let newTagNo = '';
    if (props.areaType && props.discipline && props.description) {
        if (props.areaType.value === 'PreArea') {
            newTagNo = '#PRE';
        } else {
            newTagNo = '#SITE';
        }
        newTagNo = `${newTagNo}-${props.discipline.code}`;
        if (props.area) {
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
        const mapped = disciplines.map((itm: Discipline) => {
            return {
                text: itm.description,
                value: itm.code
            };
        });
        setMappedDisciplines(mapped);
    }, [disciplines]);

    const setAreaTypeForm = (value: string): void => {
        props.setAreaType(areaTypes.find((p: SelectItem) => p.value === value));
    };

    const setDisciplineForm = (value: string): void => {
        props.setDiscipline(disciplines.find((p: Discipline) => p.code === value));
    };

    const nextStep = (): void => {
        const tag: Tag = {
            tagNo: newTagNo,
            description: props.description || '',
        };
        props.setSelectedTags([tag]);
        props.nextStep();
    };

    const checkTagNo = async (areaType: string, area: string, discipline: string, suffix: string): Promise<void> => {
        try {
            const response = await apiClient.checkAreaTagNo(
                project.name,
                areaType,
                discipline,
                area,
                suffix);
            setTagNoValid(!response.exists);
            setRequiredFieldsFilled(true);
            setLoading(false);
        } catch (error) {
            console.error('Get tag nos failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    useEffect(() => {
        setLoading(true);

        const checkTagNos = () => {
            if (props.suffix && /\s/.test(props.suffix)) {
                setTagNoValid(false);
                setRequiredFieldsFilled(true);
                setLoading(false);
            } else if (props.area && props.discipline && props.areaType && props.suffix) {
                checkTagNo(props.areaType.value, props.area.code, props.discipline.code, props.suffix);
            } else {
                setRequiredFieldsFilled(false);
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            checkTagNos();
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, [props.discipline, props.area, props.areaType, props.suffix]);

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
                            {(props.areaType && props.areaType.text) || 'Select'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <FormFieldSpacer>
                        <SelectInput
                            onChange={setDisciplineForm}
                            data={mappedDisciplines}
                            label={'Discipline'}
                        >
                            {(props.discipline && props.discipline.description) || 'Select'}
                        </SelectInput>
                    </FormFieldSpacer>
                    <FormFieldSpacer>
                        <Dropdown
                            label={'Area'}
                            variant='form'
                            text={(props.area && props.area?.description) || 'Type to select'}
                            onFilter={setFilterForAreas}
                        >
                            {filteredAreas.map((areaItem, index) => {
                                return (
                                    <DropdownItem
                                        key={index}
                                        onClick={(event): void =>
                                            changeArea(event, index)
                                        }
                                    >
                                        {areaItem.text}
                                    </DropdownItem>
                                );
                            })}
                        </Dropdown>
                    </FormFieldSpacer>
                    <Next>
                        <Button onClick={nextStep} disabled={newTagNo === ''}>Next</Button>
                    </Next>
                </InputContainer>
            </Container >
            <Container >
                <InputContainer>
                    <FormFieldSpacer>
                        <TextField
                            id={'Suffix'}
                            style={{ maxWidth: '200px' }}
                            label="Tag number suffix (space not allowed)"
                            inputRef={suffixInputRef}
                            placeholder="Write Here"
                            helpertext="Text added to the end of the tagno."
                            onChange={(e: any): void => props.setSuffix(e.target.value)}
                        />
                    </FormFieldSpacer>
                    {requiredFieldsFilled &&
                    <FormFieldSpacer
                        id='tagNumberIcon'
                        className={tagNoValid ? 'valid' : 'invalid' }
                    >
                        {loading ?
                            <CenterContent>
                                <Spinner />
                            </CenterContent>
                            : tagNoValid
                                ? <CheckIcon />
                                : <Tooltip title='Tag number is already in use or is not a valid format.'>
                                    <ErrorOutlineIcon />
                                </Tooltip>
                        }
                    </FormFieldSpacer>
                    }
                </InputContainer>
            </Container >
            <Container >
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
            </Container >
        </div >
    );
};

export default CreateAreaTag;
