import { Button, Typography } from '@equinor/eds-core-react';
import {
    Container,
    ContentContainer,
    DropdownItem,
    FilterContainer,
    Header,
    HeaderContainer,
    IconBar,
    LeftPartOfHeader,
    StyledButton,
    TooltipText,
} from './SearchIpo.style';
import { IPOFilter, IPOs, SavedIPOFilter } from './types';
import React, { useEffect, useReducer, useRef, useState } from 'react';

import { Canceler } from 'axios';
import Dropdown from '@procosys/components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import InvitationsFilter from './Filter/InvitationsFilter';
import InvitationsTable from './Table';
import { Link } from 'react-router-dom';
import { ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import { SelectItem } from '@procosys/components/Select';
import Spinner from '@procosys/components/Spinner';
import { Tooltip } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';

const addIcon = <EdsIcon name="add" />;

const emptyFilter: IPOFilter = {
    ipoStatuses: [],
    functionalRoleCode: '',
    personOid: '',
    ipoIdStartsWith: '',
    commPkgNoStartsWith: '',
    mcPkgNoStartsWith: '',
    titleStartsWith: '',
    punchOutDates: [],
};

const SearchIPO = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(25);
    const [filter, setFilter] = useState<IPOFilter>({ ...emptyFilter });
    const [resetTablePaging, setResetTablePaging] = useState<boolean>(false);
    const { apiClient, project, setCurrentProject, availableProjects } =
        useInvitationForPunchOutContext();
    const [filteredProjects, setFilteredProjects] =
        useState<ProjectDetails[]>(availableProjects);
    const [filterForProjects, setFilterForProjects] = useState<string>('');

    const isFirstRender = useRef<boolean>(true);
    const [update, forceUpdate] = useReducer((x) => x + 1, 0); // Used to force an update on table
    const [filterUpdate, forceFilterUpdate] = useReducer((x) => x + 1, 0); // Used to force update on table with filter change

    const [numberOfIPOs, setNumberOfIPOs] = useState<number>(10);
    const numberOfFilters: number = Object.values(filter).filter(
        (v) => v && JSON.stringify(v) != '[]'
    ).length;

    const cancelerRef = useRef<Canceler | null>();

    const [availableRoles, setAvailableRoles] = useState<SelectItem[]>([]);

    const [selectedSavedFilterTitle, setSelectedSavedFilterTitle] = useState<
        string | null
    >(null);
    const [savedFilters, setSavedFilters] = useState<SavedIPOFilter[] | null>(
        null
    );
    const [hasProjectChanged, setHasProjectChanged] = useState<boolean>(true);

    const [orderByField, setOrderByField] = useState<string | null>(null);
    const [orderDirection, setOrderDirection] = useState<string | null>(null);
    const [dataLoading, setDataLoading] = useState<boolean>(false);

    const updateSavedFilters = async (): Promise<void> => {
        setIsLoading(true);
        if (project === undefined) {
            console.error('The project is of type undefined');
            showSnackbarNotification(
                'Get saved filters failed: The project is of type undefined'
            );
            setIsLoading(false);
            return;
        }
        try {
            const response = await apiClient.getSavedIPOFilters(
                project.name === 'All projects' ? null : project.name
            );
            setSavedFilters(response);
        } catch (error) {
            console.error(
                'Get saved filters failed: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message);
        }
        setIsLoading(false);
    };

    useEffect((): void => {
        updateSavedFilters();
    }, [project]);

    const getDefaultFilter = (): SavedIPOFilter | undefined => {
        if (savedFilters) {
            const defaultFilter = savedFilters.find(
                (filter) => filter.defaultFilter
            );
            return defaultFilter;
        }
        return undefined;
    };

    useEffect((): void => {
        if (hasProjectChanged) {
            if (savedFilters) {
                const defaultFilter = getDefaultFilter();
                if (defaultFilter) {
                    setSelectedSavedFilterTitle(defaultFilter.title);
                    try {
                        setFilter({
                            ...JSON.parse(defaultFilter.criteria),
                        });
                    } catch (error) {
                        console.error('Failed to parse default filter');
                    }
                } else {
                    setFilter({
                        ...emptyFilter,
                    });
                }
            }
            setHasProjectChanged(false);
        }
    }, [savedFilters]);

    /**
     * Fetch available functional roles
     */
    useEffect(() => {
        let requestCanceler: Canceler;
        try {
            (async (): Promise<void> => {
                const functionalRoles = await apiClient.getFunctionalRolesAsync(
                    (cancelerCallback) => (requestCanceler = cancelerCallback)
                );
                setAvailableRoles(
                    functionalRoles.map((role): SelectItem => {
                        return {
                            text: role.code,
                            value: role.code,
                        };
                    })
                );
            })();
            return (): void => requestCanceler && requestCanceler();
        } catch (error) {
            showSnackbarNotification(error.message);
        }
    }, []);

    useEffect(() => {
        const allProjects: ProjectDetails = {
            id: -1,
            name: 'All projects',
            description: 'All projects in plant',
        };

        if (availableProjects.length > 0) {
            if (availableProjects[0].id !== -1) {
                availableProjects.unshift(allProjects);
            }
        } else {
            availableProjects.push(allProjects);
        }

        if (filterForProjects.length <= 0) {
            setFilteredProjects(availableProjects);
            return;
        }

        setFilteredProjects(
            availableProjects.filter((p: ProjectDetails) => {
                return (
                    p.name
                        .toLowerCase()
                        .indexOf(filterForProjects.toLowerCase()) > -1 ||
                    p.description
                        .toLowerCase()
                        .indexOf(filterForProjects.toLowerCase()) > -1
                );
            })
        );
    }, [filterForProjects]);

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();

        setCurrentProject(filteredProjects[index].id);
        setResetTablePaging(true);
        setHasProjectChanged(true);

        if (numberOfFilters > 0) {
            // Reset filters on project change:
            // When the filter is hidden, we reset the selected filters here, which further triggers a refresh of the scope list.
            // When the filter is displayed, the filter reset and scope list refresh is handled by the filter component.

            if (!displayFilter) {
                setFilter({ ...emptyFilter });
            }
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
            window.removeEventListener(
                'resize',
                updateModuleAreaHeightReference
            );
        };
    }, []);

    /** Update module header height on module header resize */
    useEffect(() => {
        updateModuleHeaderHeightReference();
    }, [moduleHeaderContainerRef, displayFilter]);

    useEffect(() => {
        window.addEventListener('resize', updateModuleHeaderHeightReference);

        return (): void => {
            window.removeEventListener(
                'resize',
                updateModuleHeaderHeightReference
            );
        };
    }, []);

    useEffect(() => {
        forceUpdate();
    }, [displayFilter]);

    useEffect(() => {
        if (isFirstRender.current) {
            // skip refreshing scope list on first render, when default/empty filters are set
            isFirstRender.current = false;
            return;
        }

        setResetTablePaging(true);
        forceFilterUpdate();
    }, [filter]);

    const toggleFilter = (): void => {
        setDisplayFilter(!displayFilter);
    };

    const getIPOs = async (
        page: number,
        pageSize: number,
        orderBy: string | null,
        orderDirection: string | null
    ): Promise<IPOs> => {
        if (project) {
            //to avoid getting ipos before we have set previous-/default filter (include savedFilters if used)
            try {
                setDataLoading(true);
                cancelerRef.current && cancelerRef.current();
                return await apiClient
                    .getIPOs(
                        project.name,
                        page,
                        pageSize,
                        orderBy,
                        orderDirection,
                        filter,
                        (c) => {
                            cancelerRef.current = c;
                        }
                    )
                    .then((response) => {
                        setNumberOfIPOs(response.maxAvailable);
                        setDataLoading(false);
                        return response;
                    });
            } catch (error) {
                console.error('Get IPOs failed: ', error.message, error.data);
                // setDataLoading(false);
                if (!error.isCancel) {
                    showSnackbarNotification(error.message);
                }
            }
        }
        setNumberOfIPOs(0);
        return { maxAvailable: 0, invitations: [] };
    };

    const exportInvitationsToExcel = async (): Promise<void> => {
        if (project) {
            try {
                showSnackbarNotification('Exporting filtered IPOs to Excel...');
                await apiClient
                    .exportInvitationsToExcel(
                        project.name,
                        orderByField,
                        orderDirection,
                        filter
                    )
                    .then((response) => {
                        const outputFilename = `Invitations for Punch Out-${project.name}.xlsx`;
                        const tempUrl = window.URL.createObjectURL(
                            new Blob([response])
                        );
                        const tempLink = document.createElement('a');
                        tempLink.style.display = 'none';
                        tempLink.href = tempUrl;
                        tempLink.setAttribute('download', outputFilename);
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        tempLink.remove();
                    });
                showSnackbarNotification('IPOs are exported to Excel');
            } catch (error) {
                console.error(
                    'Export IPOs to excel failed: ',
                    error.message,
                    error.data
                );
                if (!error.isCancel) {
                    showSnackbarNotification(error.message);
                }
            }
        }
    };

    return (
        <Container ref={moduleContainerRef}>
            <ContentContainer withSidePanel={displayFilter}>
                <HeaderContainer ref={moduleHeaderContainerRef}>
                    <LeftPartOfHeader>
                        <Header>
                            <Typography variant="h1">
                                Invitation for punch-out
                            </Typography>
                        </Header>
                        <IconBar>
                            {
                                <Dropdown
                                    maxHeight="300px"
                                    text={
                                        project
                                            ? project.name
                                            : 'Select project'
                                    }
                                    onFilter={setFilterForProjects}
                                >
                                    {isLoading && (
                                        <div
                                            style={{
                                                margin: 'calc(var(--grid-unit))',
                                            }}
                                        >
                                            <Spinner medium />
                                        </div>
                                    )}
                                    {!isLoading &&
                                        filteredProjects &&
                                        filteredProjects.map(
                                            (projectItem, index) => {
                                                return (
                                                    <DropdownItem
                                                        key={index}
                                                        onClick={(
                                                            event
                                                        ): void =>
                                                            changeProject(
                                                                event,
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <div>
                                                            {
                                                                projectItem.description
                                                            }
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '12px',
                                                            }}
                                                        >
                                                            {projectItem.name}
                                                        </div>
                                                    </DropdownItem>
                                                );
                                            }
                                        )}
                                </Dropdown>
                            }
                            <Link
                                to={
                                    project
                                        ? `/CreateIPO/${project.name}`
                                        : '/CreateIPO'
                                }
                            >
                                <Button variant="ghost">
                                    {addIcon} New IPO
                                </Button>
                            </Link>
                        </IconBar>
                    </LeftPartOfHeader>
                    <Tooltip
                        placement={'left'}
                        title={
                            <TooltipText>
                                <p>{numberOfFilters} active filter(s)</p>
                                <p>Filter result {numberOfIPOs} items</p>
                            </TooltipText>
                        }
                        disableHoverListener={numberOfFilters < 1}
                        arrow={true}
                        style={{ textAlign: 'center' }}
                    >
                        <div>
                            <StyledButton
                                id="filterButton"
                                variant={
                                    numberOfFilters > 0 ? 'contained' : 'ghost'
                                }
                                onClick={(): void => {
                                    toggleFilter();
                                }}
                            >
                                <EdsIcon name="filter_list" />
                            </StyledButton>
                        </div>
                    </Tooltip>
                </HeaderContainer>

                <InvitationsTable
                    loading={dataLoading}
                    getIPOs={getIPOs}
                    data-testId="invitationsTable"
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    shouldSelectFirstPage={resetTablePaging}
                    setFirstPageSelected={(): void =>
                        setResetTablePaging(false)
                    }
                    projectName={project?.name}
                    height={moduleAreaHeight - moduleHeaderHeight - 100}
                    update={update}
                    setOrderByField={setOrderByField}
                    filterUpdate={filterUpdate}
                    setOrderDirection={setOrderDirection}
                />
            </ContentContainer>
            {displayFilter && (
                <FilterContainer maxHeight={moduleAreaHeight}>
                    <InvitationsFilter
                        project={project}
                        onCloseRequest={(): void => {
                            setDisplayFilter(false);
                        }}
                        filter={filter}
                        setFilter={setFilter}
                        savedFilters={savedFilters}
                        refreshSavedFilters={updateSavedFilters}
                        setSelectedSavedFilterTitle={
                            setSelectedSavedFilterTitle
                        }
                        selectedSavedFilterTitle={selectedSavedFilterTitle}
                        roles={availableRoles}
                        numberOfIPOs={numberOfIPOs}
                        exportInvitationsToExcel={exportInvitationsToExcel}
                    />
                </FilterContainer>
            )}
        </Container>
    );
};

export default SearchIPO;
