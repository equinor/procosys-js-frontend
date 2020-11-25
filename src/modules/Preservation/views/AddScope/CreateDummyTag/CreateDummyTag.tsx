import { Area, CheckAreaTagNo, Discipline, PurchaseOrder, Tag } from '../types';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { ButtonsContainer, CenterContent, Container, DropdownItem, ErrorContainer, FormFieldSpacer, Header, InputContainer, SuffixTextField, TopContainer } from './CreateDummyTag.style';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import { Canceler } from 'axios';
import Dropdown from '../../../../../components/Dropdown';
import EdsIcon from '../../../../../components/EdsIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { showSnackbarNotification } from '../../../../../core/services/NotificationService';
import { useHistory } from 'react-router-dom';
import { usePreservationContext } from '../../../context/PreservationContext';
import { useProcosysContext } from '@procosys/core/ProcosysContext';
import Spinner from '@procosys/components/Spinner';

const invalidTagNoMessage = 'An area tag with this tag number already exists. Please adjust the parameters to create a unique tag number.';
const spacesInTagNoMessage = 'The suffix cannot containt spaces.';
const errorIcon = <EdsIcon name='error_filled' size={16} />;

const areaTypes: SelectItem[] = [
    { text: 'Area (#PRE)', value: 'PreArea' },
    { text: 'Local storage (#SITE)', value: 'SiteArea' },
    { text: 'Supplier (#PO)', value: 'PoArea' }];

type AreaItem = {
    text: string;
    value: string;
};

type POItem = {
    text: string;
    value: string;
};

type CreateDummyTagProps = {
    nextStep?: () => void;
    setSelectedTags: (tags: Tag[]) => void;
    setAreaType: (areaType?: SelectItem) => void;
    setDiscipline: (discipline?: Discipline) => void;
    setArea: (area?: Area | null) => void;
    setPurchaseOrder: (purchaseOrder?: PurchaseOrder | null) => void;
    setDescription: (description?: string) => void;
    setSuffix: (suffix: string) => void;
    areaType?: SelectItem;
    discipline?: Discipline;
    area?: Area | null;
    purchaseOrder?: PurchaseOrder | null;
    suffix?: string;
    description?: string;
    selectedTags?: Tag[];
    submit?: () => Promise<void>;
    duplicateTagId?: number;
    isSubmittingScope: boolean;
}

const CreateDummyTag = (props: CreateDummyTagProps): JSX.Element => {
    const { apiClient, libraryApiClient, project, purchaseOrderNumber } = usePreservationContext();
    const { procosysApiClient } = useProcosysContext();

    const [mappedDisciplines, setMappedDisciplines] = useState<SelectItem[]>([]);
    const suffixInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);
    const [disciplines, setDisciplines] = useState<Discipline[]>();
    const [filterForAreas, setFilterForAreas] = useState<string>('');
    const [allAreas, setAllAreas] = useState<AreaItem[]>();
    const [filteredAreas, setFilteredAreas] = useState<AreaItem[]>(allAreas ? allAreas : []);
    const [filterForPOs, setFilterForPOs] = useState<string>('');
    const [allPOs, setAllPOs] = useState<POItem[]>([]);
    const [filteredPOs, setFilteredPOs] = useState<POItem[]>(allPOs);
    const [tagNoValidationError, setTagNoValidationError] = useState<string | null>(null);
    const [tagNoValid, setTagNoValid] = useState<boolean>(false);
    const [icon, setIcon] = useState<JSX.Element | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const history = useHistory();

    useEffect(() => {
        (allAreas && disciplines) ? setIsLoading(false) : setIsLoading(true);
    }, [allAreas, disciplines]);

    const getTagDetails = async (tagId: number): Promise<Tag | null> => {
        try {
            return await apiClient.getTagDetails(tagId);
        }
        catch (error) {
            console.error(`Get tag details failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
        return null;
    };

    /** Load areas */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const response = await libraryApiClient.getAreas((cancel: Canceler) => { requestCancellor = cancel; });
                const areas = response.map(area => ({
                    text: area.code + ' - ' + area.description,
                    value: area.code,
                }));
                setAllAreas(areas);
            } catch (error) {
                console.error('Get areas failed: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);


    /** Fill in values from tag to duplicate, if applicable */
    useEffect(() => {
        let requestCancellor: Canceler;
        (async (): Promise<void> => {
            if (props.duplicateTagId && disciplines && allAreas) {
                const response = await getTagDetails(props.duplicateTagId);
                if (response && response.tagType) {
                    setAreaTypeForm(response.tagType);
                    response.areaCode && setAreaForm(response.areaCode);
                    response.disciplineCode && setDisciplineForm(response.disciplineCode);
                    props.setDescription(response.description);
                }
            }
        })();
        return (): void => requestCancellor && requestCancellor();
    }, [props.duplicateTagId, disciplines, allAreas]);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const response = await procosysApiClient.getPurchaseOrders(project.name, (cancel: Canceler) => { requestCancellor = cancel; });
                const purchaseOrders = response.map(po => ({
                    text: po.title + ' - ' + po.description,
                    value: po.title,
                }));
                setAllPOs(purchaseOrders);
            } catch (error) {
                console.error('Get purchase ordres failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
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
        props.setArea(null);
    };

    const changePO = (event: React.MouseEvent | null, poIndex: number): void => {
        if (event) {
            event.preventDefault();
        }
        const newPO = {
            title: filteredPOs[poIndex].value,
            description: filteredPOs[poIndex].text
        } as PurchaseOrder;
        props.setPurchaseOrder(newPO);
    };

    /** Update list of areas based on filter */
    useEffect(() => {
        if (allAreas) {
            if (filterForAreas.length <= 0) {
                setFilteredAreas(allAreas);
                return;
            }
            setFilteredAreas(allAreas.filter((p: AreaItem) => p.text.toLowerCase().indexOf(filterForAreas.toLowerCase()) > -1));
        }
    }, [filterForAreas, allAreas]);

    useEffect(() => {
        if (filterForPOs.length <= 0) {
            setFilteredPOs(allPOs);
            return;
        }
        setFilteredPOs(allPOs.filter((p: POItem) => p.text.toLowerCase().indexOf(filterForPOs.toLowerCase()) > -1));
    }, [filterForPOs, allPOs]);

    useEffect(() => {
        if (purchaseOrderNumber && filteredPOs && filteredPOs.length > 0) {
            props.setAreaType(areaTypes.find((areaType) => areaType.value === 'PoArea'));

            const poIndex = filteredPOs.findIndex((po) => po.value === purchaseOrderNumber);
            if (poIndex > -1) {
                changePO(null, poIndex);
            } else {
                showSnackbarNotification('Error occured. Purchase order number not found in list.', 5000);
            }
        }
    }, [purchaseOrderNumber, filteredPOs]);

    /** Get disciplines from api */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await libraryApiClient.getDisciplines(['PRESERVATION'], (cancel: Canceler) => requestCancellor = cancel);
                setDisciplines(data);
            } catch (error) {
                console.error('Get disciplines failed: ', error.message, error.data);
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
        } else if (props.areaType.value === 'PoArea') {
            newTagNo = '#PO';
        } else {
            newTagNo = '#SITE';
        }
        newTagNo = `${newTagNo}-${props.discipline.code}`;
        if (props.areaType.value != 'PoArea' && props.area) {
            newTagNo = `${newTagNo}-${props.area.code}`;
        } else if (props.areaType.value == 'PoArea' && props.purchaseOrder) {
            newTagNo = `${newTagNo}-${props.purchaseOrder.title}`;
        }
        props.suffix ? newTagNo = `${newTagNo}-${props.suffix}` : null;
    }


    /** Map disciplines into select elements */
    useEffect(() => {
        if (disciplines) {
            const mapped = disciplines.map((itm: Discipline) => {
                return {
                    text: itm.description,
                    value: itm.code
                };
            });
            setMappedDisciplines(mapped);
        }
    }, [disciplines]);

    const setAreaTypeForm = (value: string): void => {
        const newAreaType = areaTypes.find((p: SelectItem) => p.value === value);
        props.setAreaType(newAreaType);
    };

    useEffect(() => {
        if (props.areaType && props.areaType.value == 'PoArea') {
            props.setArea(null);
        } else {
            props.setPurchaseOrder(null);
        }
    }, [props.areaType]);

    useEffect(() => {
        descriptionInputRef.current && props.description ? descriptionInputRef.current.value = props.description : null;
    }, [props.description]);

    useEffect(() => {
        suffixInputRef.current && props.suffix ? suffixInputRef.current.value = props.suffix : null;
    }, [props.suffix]);

    const setDisciplineForm = (value: string): void => {
        if (disciplines) {
            props.setDiscipline(disciplines.find((p: Discipline) => p.code === value));
        }
    };

    const setAreaForm = (areaCode: string): void => {
        if (allAreas) {
            const area = allAreas.find((area) => area.value == areaCode);
            if (area) {
                const newArea = {
                    code: area.value,
                    description: area.text
                } as Area;
                props.setArea(newArea);
            };
        }
    };

    const nextStep = (): void => {
        const tag: Tag = {
            tagNo: newTagNo,
            description: props.description || '',
        };
        props.setSelectedTags([tag]);

        if (props.duplicateTagId) {
            props.submit && props.submit();
        } else {
            props.nextStep && props.nextStep();
        }
    };

    const checkTagNo = async (areaType: string, discipline: string, area: string | null, po: string | null, suffix: string | null): Promise<CheckAreaTagNo> => {
        try {
            const response = await apiClient.checkAreaTagNo(
                project.name,
                areaType,
                discipline,
                area,
                po,
                suffix);

            return response;
        } catch (error) {
            console.error('Get tag nos failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return { tagNo: '', exists: true };
    };

    useEffect(() => {
        const checkTagNos = async (): Promise<void> => {
            if (props.discipline && props.areaType && props.areaType.value != 'PoArea') {
                const areaCode = (props.area) ? props.area.code : null;
                const response = await checkTagNo(props.areaType.value, props.discipline.code, areaCode, null, props.suffix || null);
                props.setSelectedTags([{
                    tagNo: response.tagNo,
                    description: props.description || ''
                }]);
                setTagNoValid(!response.exists);
                setTagNoValidationError(!response.exists ? null : invalidTagNoMessage);
            } else if (props.areaType && props.discipline && props.purchaseOrder && props.areaType.value == 'PoArea') {
                const response = await checkTagNo(props.areaType.value, props.discipline.code, null, props.purchaseOrder.title, props.suffix || null);
                props.setSelectedTags([{
                    tagNo: response.tagNo,
                    description: props.description || ''
                }]);
                setTagNoValid(!response.exists);
                setTagNoValidationError(!response.exists ? null : invalidTagNoMessage);
            } else {
                props.setSelectedTags([{
                    tagNo: 'type-discipline-area/PO-suffix',
                    description: props.description || ''
                }]);
                setTagNoValid(false);
                setTagNoValidationError(null);
            }

            if (props.suffix && /\s/.test(props.suffix)) {
                setTagNoValidationError(spacesInTagNoMessage);
                setTagNoValid(false);
            }
        };

        const timer = setTimeout(() => {
            checkTagNos();
        }, 200);

        return (): void => {
            clearTimeout(timer);
        };
    }, [props.discipline, props.area, props.areaType, props.suffix, props.purchaseOrder]);

    const checkSuffix = (e: React.ChangeEvent<HTMLInputElement>): void => {
        props.setSuffix(e.target.value.toUpperCase());
        if (e.target.value.includes(' ')) {
            setIcon(errorIcon);
        } else {
            setIcon(null);
        }
    };

    useEffect(() => {
        if (props.selectedTags && props.selectedTags.length > 0) {
            props.setSelectedTags([{
                tagNo: props.selectedTags[0].tagNo,
                description: props.description || ''
            }
            ]);
        }
    }, [props.description]);

    const cancel = (): void => {
        history.push('/');
    };

    return (
        <div>
            <Header>
                {!props.duplicateTagId && <Typography variant="h1">Create dummy tag</Typography>}
                {props.duplicateTagId && <Typography variant="h1">Duplicate dummy tag</Typography>}
                <div>{project.name}</div>
                {purchaseOrderNumber &&
                    <div style={{ marginLeft: 'calc(var(--grid-unit) * 4)' }}>PO number: {purchaseOrderNumber}</div>
                }
            </Header>
            <TopContainer>
                <ErrorContainer>
                    {tagNoValidationError && (<Typography variant="caption">{tagNoValidationError}</Typography>)}
                </ErrorContainer>
                <Container>
                    <InputContainer>
                        {isLoading && <Spinner />}
                        <FormFieldSpacer>
                            <SelectInput
                                onChange={setAreaTypeForm}
                                data={areaTypes}
                                label={'Dummy type'}
                                disabled={isLoading || purchaseOrderNumber ? true : false || props.duplicateTagId ? true : false}
                            >
                                {(props.areaType && props.areaType.text) || 'Select'}
                            </SelectInput>
                        </FormFieldSpacer>
                        <FormFieldSpacer>
                            <SelectInput
                                onChange={setDisciplineForm}
                                disabled={isLoading}
                                data={mappedDisciplines}
                                label={'Discipline'}
                            >
                                {(props.discipline && props.discipline.description) || 'Select'}
                            </SelectInput>
                        </FormFieldSpacer>
                        <FormFieldSpacer>
                            {(props.areaType && props.areaType.value == 'PoArea') ?
                                <Dropdown
                                    disabled={isLoading || purchaseOrderNumber ? true : false}
                                    label={'PO/Calloff'}
                                    variant='form'
                                    text={(props.purchaseOrder && props.purchaseOrder.description) || 'Type to select'}
                                    onFilter={setFilterForPOs}
                                >
                                    {filteredPOs.map((POItem, index) => {
                                        return (
                                            <DropdownItem
                                                key={index}
                                                onClick={(event): void =>
                                                    changePO(event, index)
                                                }
                                            >
                                                {POItem.text}
                                            </DropdownItem>
                                        );
                                    })}
                                </Dropdown>
                                :
                                <Dropdown
                                    disabled={isLoading || !props.areaType}
                                    label={props.areaType ? 'Area' : ''}
                                    variant='form'
                                    meta={props.areaType ? 'Optional' : ''}
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
                            }
                        </FormFieldSpacer>
                        <ButtonsContainer>
                            <Button onClick={cancel} variant='outlined' >Cancel</Button>
                            <Button onClick={nextStep} disabled={newTagNo === '' || !tagNoValid || props.isSubmittingScope} >
                                {props.isSubmittingScope && (
                                    <CenterContent>
                                        <Spinner />{props.duplicateTagId ? 'Duplicate' : 'Next'}
                                    </CenterContent>
                                )}
                                {!props.isSubmittingScope && (props.duplicateTagId ? 'Duplicate' : 'Next')}

                            </Button>
                        </ButtonsContainer>
                    </InputContainer>
                </Container >
            </TopContainer>
            <InputContainer>
                <SuffixTextField
                    id={'Suffix'}
                    data-testid={'suffix'}
                    label="Tag number suffix"
                    inputRef={suffixInputRef}
                    placeholder="Write here"
                    helperText="Spaces are not allowed"
                    helperIcon={icon}
                    variant={icon ? 'error' : 'default'}
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
                    value={props.description}
                    multiline={true}
                    placeholder="Write here"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.setDescription(e.target.value)}
                />
            </InputContainer>
        </div>
    );
};

export default CreateDummyTag;
