import { Container, FormFieldSpacer, Next, Header, InputContainer, DropdownItem, TopContainer, SuffixTextField, ErrorContainer } from './CreateAreaTag.style';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../../context/PreservationContext';
import { Tag, Discipline, Area } from '../types';
import { Canceler } from 'axios';
import { showSnackbarNotification } from './../../../../../core/services/NotificationService';
import Dropdown from '../../../../../components/Dropdown';
import EdsIcon from '../../../../../components/EdsIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const invalidTagNoMessage = 'An area tag with this tag number already exists. Please adjust the parameters to create a unique tag number.';
const spacesInTagNoMessage = 'The suffix cannot containt spaces.';
const errorIcon = <EdsIcon name='error_filled' size={16} />;

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

    const [tagNoValidationError, setTagNoValidationError] = useState<string | null>(null);
    const [tagNoValid, setTagNoValid] = useState<boolean>(false);

    const [icon, setIcon] = useState<JSX.Element | null>(null);

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

    const clearArea = (e: React.MouseEvent): void => {
        e.stopPropagation();
        props.setArea(undefined);
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

    const checkTagNo = async (areaType: string, discipline: string, area: string | null, suffix: string | null): Promise<boolean> => {
        try {
            const response = await apiClient.checkAreaTagNo(
                project.name,
                areaType,
                discipline,
                area,
                suffix);
            return !response.exists;
        } catch (error) {
            console.error('Get tag nos failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
            return false;
        }
    };

    useEffect(() => {
        const checkTagNos = async (): Promise<void> => {
            if (props.suffix && /\s/.test(props.suffix)) {
                setTagNoValidationError(spacesInTagNoMessage);
            }
            else if (props.discipline && props.areaType) {
                const areaCode = (props.area) ? props.area.code : null;
                const validTagNo = await checkTagNo(props.areaType.value, props.discipline.code, areaCode, props.suffix ?? null);
                setTagNoValid(validTagNo);
                setTagNoValidationError(validTagNo ? null : invalidTagNoMessage);
            } else {
                setTagNoValidationError(null);
            }
        };

        const timer = setTimeout(() => {
            checkTagNos();
        }, 200);

        return (): void => {
            clearTimeout(timer);
        };
    }, [props.discipline, props.area, props.areaType, props.suffix]);

    const checkSuffix = (e: React.ChangeEvent<HTMLInputElement>): void => {
        props.setSuffix(e.target.value);
        if(e.target.value.includes(' ')) {
            setIcon(errorIcon);
        } else {
            setIcon(null);
        }
    };

    return (
        <div>
            <Header>
                <h1>Create Area Tag</h1>
                <div>{project.description}</div>
            </Header>
            <TopContainer>
                <ErrorContainer>
                    {tagNoValidationError && (<Typography variant="caption">{tagNoValidationError}</Typography>)}
                </ErrorContainer>
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
                                meta="Optional"
                                Icon={(props.area && props.area.description)
                                    ? <div id='dropdownIcon' onClick={clearArea}><EdsIcon name='close' /></div>
                                    : <KeyboardArrowDownIcon />}
                                text={(props.area && props.area.description) || 'Type to select'}
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
                            <Button onClick={nextStep} disabled={newTagNo === '' || !tagNoValid}>Next</Button>
                        </Next>
                    </InputContainer>
                </Container >
            </TopContainer>
            <InputContainer>
                <SuffixTextField
                    id={'Suffix'}
                    label="Tag number suffix"
                    inputRef={suffixInputRef}
                    placeholder="Write Here"
                    helperText="Spaces are not allowed"
                    helperIcon={icon}
                    variant={icon ? 'error': 'default' }
                    meta="Optional"
                    onChange={checkSuffix}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.setDescription(e.target.value)}
                />
            </InputContainer>
        </div >
    );
};

export default CreateAreaTag;
