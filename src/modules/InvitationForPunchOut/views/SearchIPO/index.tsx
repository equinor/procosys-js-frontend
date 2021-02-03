import { Container, ContentContainer, DropdownItem, FilterContainer, Header, HeaderContainer, StyledButton, TooltipText } from './index.style';
import { Filter, IPOs, SavedIPOFilter } from './types';
import React, { useEffect, useRef, useState } from 'react';

import { Canceler } from 'axios';
import Dropdown from '@procosys/components/Dropdown';
import InvitationsTable from './Table';
import { ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import Spinner from '@procosys/components/Spinner';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';

const emptyFilter = {

};

const SearchIPO = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState<boolean>(false);
    const [showActions, setShowActions] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(50);
    const [filter, setFilter] = useState<Filter>({ ...emptyFilter });
    const [resetTablePaging, setResetTablePaging] = useState<boolean>(false);
    const [orderDirection, setOrderDirection] = useState<string | null>(null);
    const [orderByField, setOrderByField] = useState<string | null>(null);
    const { apiClient } = useInvitationForPunchOutContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [project, setProject] = useState<ProjectDetails>();
    const [filterForProjects, setFilterForProjects] = useState<string>('');

    const [savedIPOFilters, setSavedIPOFilters] = useState<SavedIPOFilter[] | null>(null);
    const [numberOfIPOs, setNumberOfIPOs] = useState<number>(10);
    const numberOfFilters = 0;

    const refreshListCallback = useRef<(maxHeight: number, refreshOnResize?: boolean) => void>();
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
            refreshList();
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



    const toggleFilter = (): void => {
        setDisplayFilter(!displayFilter);
    };


    const getIPOs = async (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null): Promise<IPOs> => {
        if (!savedIPOFilters && project) {  //to avoid getting ipos before we have set previous-/default filter
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

    const setRefreshListCallback = (callback: (maxHeight: number, refreshOnResize?: boolean) => void): void => {
        refreshListCallback.current = callback;
    };

    const refreshList = (refreshOnResize?: boolean): void => {
        refreshListCallback.current && refreshListCallback.current(moduleAreaHeight - moduleHeaderHeight - 115, refreshOnResize);
    };

    useEffect(() => {
        refreshList(true);
    }, [moduleAreaHeight, moduleHeaderHeight]);


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
                    {/* <Tooltip title={<TooltipText><p>{numberOfFilters} active filter(s)</p><p>Filter result {numberOfIPOs} items</p></TooltipText>} disableHoverListener={numberOfFilters < 1} arrow={true} style={{ textAlign: 'center' }}>
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
                    </Tooltip> */}
                </HeaderContainer >

                <InvitationsTable
                    getIPOs={getIPOs}
                    data-testId='invitationsTable'
                    // setSelectedIPOs={setSelectedIPOs}
                    setRefreshListCallback={setRefreshListCallback}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    shouldSelectFirstPage={resetTablePaging}
                    setFirstPageSelected={(): void => setResetTablePaging(false)}
                    setOrderByField={setOrderByField}
                    setOrderDirection={setOrderDirection}
                    projectName={project?.name}
                />


            </ContentContainer >
            {/* {
                displayFilter && savedIPOFilters && (
                    <FilterContainer maxHeight={moduleAreaHeight}>
                        <InvitationsFilter
                            triggerFilterValuesRefresh={triggerFilterValuesRefresh}
                            onCloseRequest={(): void => {
                                setDisplayFilter(false);
                            }}
                            tagListFilter={tagListFilter} setTagListFilter={setTagListFilter}
                            savedTagListFilters={savedTagListFilters}
                            refreshSavedTagListFilters={updateSavedTagListFilters}
                            setSelectedSavedFilterTitle={setSelectedSavedFilterTitle}
                            selectedSavedFilterTitle={selectedSavedFilterTitle}
                            numberOfTags={numberOfTags}
                            exportTagsToExcel={exportTagsToExcel} />
                    </FilterContainer>
                )
            } */}
        </Container >

    );
};

export default SearchIPO;