import { Container, ContentContainer, DropdownItem, FilterContainer, Header, HeaderContainer, StyledButton, TooltipText } from './index.style';
import { IPOFilter, IPOs, SavedIPOFilter } from './types';
import React, { useEffect, useRef, useState } from 'react';

import CacheService from '@procosys/core/services/CacheService';
import { Canceler } from 'axios';
import Dropdown from '@procosys/components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import InvitationsFilter from './Filter';
import InvitationsTable from './Table';
import { ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import Spinner from '@procosys/components/Spinner';
import { Tooltip } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';

const InvitationFilterCache = new CacheService('InvitationSearch');

const getCachedFilter = (projectId: number): IPOFilter | null => {
    try {
        const cacheItem = InvitationFilterCache.getCache(projectId + '-filter');
        if (cacheItem) {
            return cacheItem.data;
        }
    } catch (error) {
        showSnackbarNotification('An error occured retrieving default filter values');
        console.error('Error while retrieving cached filter values: ', error);
    }
    return null;
};

const setCachedFilter = (projectId: number, filter: IPOFilter): void => {
    try {
        InvitationFilterCache.setCache(projectId + '-filter', filter);
    } catch (error) {
        showSnackbarNotification('An error occured when saving default filter values');
        console.error('Error while caching filter values: ', error);
    }
};

const deleteCachedFilter = (projectId: number): void => {
    InvitationFilterCache.delete(projectId + '-filter');
};

const emptyFilter: IPOFilter = {
    ipoStatuses: [],
    functionalRoleCode: '',
    personOid: '',
    ipoIdStartsWith: '',
    commPkgNoStartsWith: '',
    mcPkgNoStartsWith: '',
    titleStartsWith: '',
    punchOutDates: []
};

const emptySavedFilter: SavedIPOFilter = {
    id: 0,
    title: 'savefilter',
    criteria: 'none',
    defaultFilter: false,
    rowVersion: 'wda'
};

const SearchIPO = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState<boolean>(false);
    const [showActions, setShowActions] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(50);
    const [filter, setFilter] = useState<IPOFilter>({ ...emptyFilter });
    const [resetTablePaging, setResetTablePaging] = useState<boolean>(false);
    const [orderDirection, setOrderDirection] = useState<string | null>(null);
    const [orderByField, setOrderByField] = useState<string | null>(null);
    const { apiClient } = useInvitationForPunchOutContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [project, setProject] = useState<ProjectDetails>();
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [triggerFilterValuesRefresh, setTriggerFilterValuesRefresh] = useState<number>(0); //increment to trigger filter values to update

    const [savedFilters, setSavedFilters] = useState<SavedIPOFilter[] | null>(null);
    const [selectedSavedFilterTitle, setSelectedSavedFilterTitle] = useState<string | null>(null);
    const [numberOfIPOs, setNumberOfIPOs] = useState<number>(10);
    const numberOfFilters = 0;

    // const refreshListCallback = useRef<(maxHeight: number, refreshOnResize?: boolean) => void>();
    const cancelerRef = useRef<Canceler | null>();


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

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();

        setProject(filteredProjects[index]);
        setResetTablePaging(true);

        if (numberOfFilters > 0) {
            // Reset filters on project change:
            // When the filter is hidden, we reset the selected filters here, which further triggers a refresh of the scope list.
            // When the filter is displayed, the filter reset and scope list refresh is handled by the filter component.

            if (!displayFilter) {
                setFilter({ ...emptyFilter });
            }
        } else {
            // No filters, regular scope list refresh.
            // refreshList();
        }
    };

    const moduleHeaderContainerRef = useRef<HTMLDivElement>(null);
    const [moduleHeaderHeight, setModuleHeaderHeight] = useState<number>(250);

    const moduleContainerRef = useRef<HTMLDivElement>(null);
    const [moduleAreaHeight, setModuleAreaHeight] = useState<number>(700);

    const updateModuleHeaderHeightReference = (): void => {
        if (!moduleHeaderContainerRef.current) return;
        setModuleHeaderHeight(moduleHeaderContainerRef.current.clientHeight);
    };

    const updateModuleAreaHeightReference = (): void => {
        if (!moduleContainerRef.current) return;
        setModuleAreaHeight(moduleContainerRef.current.clientHeight);
    };
    
    /** Update module area height on module resize */
    useEffect(() => {
        updateModuleAreaHeightReference();
    }, [moduleContainerRef, displayFilter]);

    useEffect(() => {
        window.addEventListener('resize', updateModuleAreaHeightReference);

        return (): void => {
            window.removeEventListener('resize', updateModuleAreaHeightReference);
        };
    }, []);


    /** Update module header height on module header resize */
    useEffect(() => {
        updateModuleHeaderHeightReference();
    }, [moduleHeaderContainerRef, displayFilter, showActions]);

    useEffect(() => {
        window.addEventListener('resize', updateModuleHeaderHeightReference);

        return (): void => {
            window.removeEventListener('resize', updateModuleHeaderHeightReference);
        };
    }, []);


    const updateSavedFilters = async (): Promise<void> => {
        setIsLoading(true);
        try {
            // const response = await apiClient.getSavedFilters(project.name);
            // setSavedFilters(response);
        } catch (error) {
            console.error('Get saved filters failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect((): void => {
        if (project && project.id != -1) {
            updateSavedFilters();
        }
    }, [project]);

    useEffect((): void => {
        if (project && project.id === -1) {
            return;
        } else if (project) {
            const previousFilter = getCachedFilter(project.id);
            if (previousFilter) {
                setFilter({
                    ...previousFilter
                });
            } else if (savedFilters) {
                const defaultFilter = getDefaultFilter();
                if (defaultFilter) {
                    setFilter({
                        ...defaultFilter
                    });
                } else {
                // refreshIPOList();
                }
            }

        }

    }, [savedFilters, project]);

    const getDefaultFilter = (): IPOFilter | null => {
        if (savedFilters) {
            const defaultFilter = savedFilters.find((filter) => filter.defaultFilter);
            if (defaultFilter) {
                try {
                    return JSON.parse(defaultFilter.criteria);
                } catch (error) {
                    console.error('Failed to parse default filter');
                }
            }
        };
        return null;
    };

    const toggleFilter = (): void => {
        setDisplayFilter(!displayFilter);
    };

    const refreshFilterValues = (): void => {
        setTriggerFilterValuesRefresh(triggerFilterValuesRefresh + 1);
    };


    const getIPOs = async (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null): Promise<IPOs> => {
        if (!savedFilters && project) {  //to avoid getting ipos before we have set previous-/default filter
            try {
                cancelerRef.current && cancelerRef.current();
                return await apiClient.getIPOs(project.name, page, pageSize, orderBy, orderDirection, filter, (c) => { cancelerRef.current = c; }).then(
                    (response) => {
                        setNumberOfIPOs(response.maxAvailable);
                        return response;
                    }
                );
            } catch (error) {
                console.error('Get IPOs failed: ', error.message, error.data);
                if (!error.isCancel) {
                    showSnackbarNotification(error.message);
                }
            }
        };
        setNumberOfIPOs(0);
        return { maxAvailable: 0, ipos: [] };
    };

    return (
        <Container ref={moduleContainerRef}>
            <ContentContainer withSidePanel={displayFilter}>
                <HeaderContainer ref={moduleHeaderContainerRef}>
                    <Header>
                        <Typography variant="h1">Invitation for punch-out</Typography>
                        { <Dropdown
                            maxHeight='300px'
                            text={project ? project.name : 'Select project'}
                            onFilter={setFilterForProjects}
                        >
                            {isLoading && <div style={{ margin: 'calc(var(--grid-unit))' }} ><Spinner medium /></div>}
                            {!isLoading && filteredProjects.map((projectItem, index) => {
                                return (
                                    <DropdownItem
                                        key={index}
                                        onClick={(event): void => changeProject(event, index)}
                                    >
                                        <div>{projectItem.description}</div>
                                        <div style={{ fontSize: '12px' }}>{projectItem.name}</div>
                                    </DropdownItem>
                                );
                            })}
                        </Dropdown>}
                    </Header>
                    <Tooltip title={<TooltipText><p>{numberOfFilters} active filter(s)</p><p>Filter result {numberOfIPOs} items</p></TooltipText>} disableHoverListener={numberOfFilters < 1} arrow={true} style={{ textAlign: 'center' }}>
                        <div>
                            <StyledButton
                                id='filterButton'
                                variant={numberOfFilters > 0 ? 'contained' : 'ghost'}
                                onClick={(): void => {
                                    toggleFilter();
                                }}
                            >
                                <EdsIcon name='filter_list' />
                            </StyledButton>
                        </div>
                    </Tooltip>
                </HeaderContainer >

                <InvitationsTable
                    getIPOs={getIPOs}
                    data-testId='invitationsTable'
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    shouldSelectFirstPage={resetTablePaging}
                    setFirstPageSelected={(): void => setResetTablePaging(false)}
                    setOrderByField={setOrderByField}
                    setOrderDirection={setOrderDirection}
                    projectName={project?.name}
                    height={moduleAreaHeight - moduleHeaderHeight - 100}
                />


            </ContentContainer >
            {
                // TODO: check savedFilters
                displayFilter && project && (
                    <FilterContainer maxHeight={moduleAreaHeight}>
                        <InvitationsFilter
                            project={project}
                            triggerFilterValuesRefresh={triggerFilterValuesRefresh}
                            onCloseRequest={(): void => {
                                setDisplayFilter(false);
                            }}
                            filter={filter} setFilter={setFilter}
                            savedFilters={[emptySavedFilter]}
                            refreshSavedFilters={updateSavedFilters}
                            setSelectedSavedFilterTitle={setSelectedSavedFilterTitle}
                            selectedSavedFilterTitle={selectedSavedFilterTitle}
                            numberOfIPOs={numberOfIPOs}
                            exportIPOsToExcel={(): void => {return;}} />
                    </FilterContainer>
                )
            }
        </Container >

    );
};

export default SearchIPO;
