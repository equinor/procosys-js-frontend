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

export type TagListFilterParamType = 'modeIds' | 'journeyIds' | 'dueFilters';

const ScopeFilter = ({
    setDisplayFilter,
    tagListFilter,
    setTagListFilter,
}: ScopeFilterProps): JSX.Element => {

    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [statusIsExpanded, setStatusIsExpanded] = useState<boolean>(false);
    const [requirementsIsExpanded, setRequirementsIsExpanded] = useState<boolean>(false);
    const [tagFunctionIsExpanded, setTagFunctionIsExpanded] = useState<boolean>(false);
    const [disciplineIsExpanded, setDisciplineIsExpanded] = useState<boolean>(false);

    const [localTagListFilter, setLocalTagListFilter] = useState<TagListFilter>({ ...tagListFilter });

    const [modes, setModes] = useState<CheckboxFilterValue[]>([]);
    const [journeys, setJourneys] = useState<CheckboxFilterValue[]>([]);

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
        const newTagListFilter: TagListFilter = { tagNoStartsWith: null, commPkgNoStartsWith: null, mcPkgNoStartsWith: null, purchaseOrderNoStartsWith: null, storageAreaStartsWith: null, journeyIds: [], modeIds: [], dueFilters: [] };
        setLocalTagListFilter(newTagListFilter);
        setTagListFilter(newTagListFilter);
    };

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

            <CheckboxFilter title='Preservation Due Date' filterValues={dueDates} checkedIds={tagListFilter.dueFilters} tagListFilterParam='dueFilters' tagListFilter={tagListFilter} setTagListFilter={setTagListFilter} />

            <CheckboxFilter title='Preserved Journeys' filterValues={journeys} checkedIds={tagListFilter.journeyIds} tagListFilterParam='journeyIds' tagListFilter={tagListFilter} setTagListFilter={setTagListFilter} />

            <CheckboxFilter title='Preserved Modes' filterValues={modes} checkedIds={tagListFilter.modeIds} tagListFilterParam='modeIds' tagListFilter={tagListFilter} setTagListFilter={setTagListFilter} />


            <Collapse isExpanded={requirementsIsExpanded} onClick={(): void => setRequirementsIsExpanded(!requirementsIsExpanded)}>
                <CollapseInfo>
                    Requirements
                </CollapseInfo>
                {
                    requirementsIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                requirementsIsExpanded && (
                    <Section>
                        todo
                    </Section>
                )
            }

            <Collapse isExpanded={tagFunctionIsExpanded} onClick={(): void => setTagFunctionIsExpanded(!tagFunctionIsExpanded)}>
                <CollapseInfo>
                    Tag Function
                </CollapseInfo>
                {
                    tagFunctionIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                tagFunctionIsExpanded && (
                    <Section>
                        todo
                    </Section>
                )
            }

            <Collapse isExpanded={disciplineIsExpanded} onClick={(): void => setDisciplineIsExpanded(!disciplineIsExpanded)}>
                <CollapseInfo>
                    Discipline
                </CollapseInfo>
                {
                    disciplineIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                disciplineIsExpanded && (
                    <Section>
                        todo
                    </Section>
                )
            }


        </Container >
    );
};

export default ScopeFilter;