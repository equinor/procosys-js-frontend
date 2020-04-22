import React, { useState, useEffect } from 'react';
import { Container, Header, Collapse, CollapseInfo, Link, Section } from './ScopeFilter.style';
import CloseIcon from '@material-ui/icons/Close';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TagListFilter } from '../types';
import { tokens } from '@equinor/eds-tokens';
import CheckboxFilter from './CheckboxFilter';
import { usePreservationContext } from '../../../context/PreservationContext';
import { Canceler } from 'axios';
import { showSnackbarNotification } from '../../../../../core/services/NotificationService';

interface ScopeFilterProps {
    setDisplayFilter: (display: boolean) => void;
    tagListFilter: TagListFilter;
    setTagListFilter: (filter: TagListFilter) => void;
}

export interface CheckboxFilterValue {
    id: string;
    title: string;
}

const dueDates: CheckboxFilterValue[] =
    [
        {
            id: 'OverDue',
            title: 'Over Due',
        },
        {
            id: 'ThisWeek',
            title: 'This Week',
        },
        {
            id: 'NextWeek',
            title: 'Next Week',
        }
    ];

export type TagListFilterParamType = 'modeIds' | 'journeyIds' | 'dueFilters' | 'requirementTypeIds' | 'tagFunctionCodes' | 'disciplineCodes';

const ScopeFilter = ({
    setDisplayFilter,
    tagListFilter,
    setTagListFilter,
}: ScopeFilterProps): JSX.Element => {

    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [statusIsExpanded, setStatusIsExpanded] = useState<boolean>(false);

    const [localTagListFilter, setLocalTagListFilter] = useState<TagListFilter>({ ...tagListFilter });

    const [modes, setModes] = useState<CheckboxFilterValue[]>([]);
    const [journeys, setJourneys] = useState<CheckboxFilterValue[]>([]);
    const [requirements, setRequirements] = useState<CheckboxFilterValue[]>([]);
    const [tagFunctions, setTagFunctions] = useState<CheckboxFilterValue[]>([]);
    const [disciplines, setDisciplines] = useState<CheckboxFilterValue[]>([]);

    const KEYCODE_ENTER = 13;

    const {
        project,
        apiClient,
    } = usePreservationContext();

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const journeys = await apiClient.getJourneyFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setJourneys(journeys);

                const modes = await apiClient.getModeFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setModes(modes);

                const requirements = await apiClient.getRequirementTypeFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setRequirements(requirements);

                const tagFunctionResp = await apiClient.getTagFunctionFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                const tagFunctions: CheckboxFilterValue[] = [];
                tagFunctionResp.map((item) => {
                    tagFunctions.push({ id: item.code, title: item.code });
                });
                setTagFunctions(tagFunctions);

                const disciplineResp = await apiClient.getDisciplineFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                const disciplines: CheckboxFilterValue[] = [];
                disciplineResp.map((item) => {
                    disciplines.push({ id: item.code, title: item.description ? item.description : item.code });  //todo: how to handle description with null value 
                });
                setDisciplines(disciplines);


            } catch (error) {
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);


    const triggerScopeListUpdate = (): void => {
        setTagListFilter(localTagListFilter);
    };

    const resetFilter = (): void => {
        const newTagListFilter: TagListFilter = { tagNoStartsWith: null, commPkgNoStartsWith: null, mcPkgNoStartsWith: null, purchaseOrderNoStartsWith: null, storageAreaStartsWith: null, journeyIds: [], modeIds: [], dueFilters: [], requirementTypeIds: [], tagFunctionCodes: [], disciplineCodes: [] };
        setLocalTagListFilter(newTagListFilter);
        setTagListFilter(newTagListFilter);
    };

    const onCheckboxFilterChange = (tagListFilterParam: TagListFilterParamType, id: string, checked: boolean): void => {
        const newTagListFilter: TagListFilter = { ...localTagListFilter };
        if (checked) {
            newTagListFilter[tagListFilterParam] = [...localTagListFilter[tagListFilterParam], id];
        } else {
            newTagListFilter[tagListFilterParam] = [...localTagListFilter[tagListFilterParam].filter(item => item != id)];
        }
        setLocalTagListFilter(newTagListFilter);
    };

    useEffect((): void => {
        triggerScopeListUpdate();
    }, [localTagListFilter.dueFilters, localTagListFilter.journeyIds, localTagListFilter.modeIds, localTagListFilter.requirementTypeIds, localTagListFilter.disciplineCodes, localTagListFilter.tagFunctionCodes]);

    return (
        <Container>
            <Header>
                <h1>Filter</h1>

                <Button variant='ghost' title='Close' onClick={(): void => { setDisplayFilter(false); }}>
                    <CloseIcon />
                </Button>
            </Header>
            <Section>
                <Link onClick={(): void => resetFilter()}>
                    <Typography style={{ color: tokens.colors.interactive.primary__resting.rgba }} variant='caption'>Reset filter</Typography>
                </Link>
            </Section>
            <Collapse isExpanded={searchIsExpanded} onClick={(): void => setSearchIsExpanded(!searchIsExpanded)}>
                <CollapseInfo>
                    Search
                </CollapseInfo>
                {
                    searchIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                searchIsExpanded && (
                    <>
                        <Section>
                            <TextField
                                id="tagNoSearch"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, tagNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.tagNoStartsWith || ''}
                                placeholder="Search tag number"
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="poNoSearch"
                                placeholder="Search purchase order number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, purchaseOrderNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.purchaseOrderNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="commPgkNoSearch"
                                placeholder="Search comm. pkg. number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, commPkgNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.commPkgNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="mcPgkNoSearch"
                                placeholder="Search mc. pkg. number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, mcPkgNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.mcPkgNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="storageAreaSearch"
                                placeholder="Search storage area"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, storageAreaStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.storageAreaStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                    </>
                )
            }

            <Collapse isExpanded={statusIsExpanded} onClick={(): void => setStatusIsExpanded(!statusIsExpanded)}>
                <CollapseInfo>
                    Preservation Status
                </CollapseInfo>
                {
                    statusIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                statusIsExpanded && (
                    <Section>
                        todo
                    </Section>
                )
            }

            <CheckboxFilter title='Preservation Due Date' filterValues={dueDates} tagListFilterParam='dueFilters' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.dueFilters} />
            <CheckboxFilter title='Preserved Journeys' filterValues={journeys} tagListFilterParam='journeyIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.journeyIds} />
            <CheckboxFilter title='Preserved Modes' filterValues={modes} tagListFilterParam='modeIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.modeIds} />
            <CheckboxFilter title='Requirements' filterValues={requirements} tagListFilterParam='requirementTypeIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.requirementTypeIds} />
            <CheckboxFilter title='Tag Functions' filterValues={tagFunctions} tagListFilterParam='tagFunctionCodes' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.tagFunctionCodes} />
            <CheckboxFilter title='Discipline' filterValues={disciplines} tagListFilterParam='disciplineCodes' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.disciplineCodes} />

        </Container >
    );
};

export default ScopeFilter;