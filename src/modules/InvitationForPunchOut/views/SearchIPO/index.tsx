import { Container, ContentContainer, DropdownItem, FilterContainer, Header, HeaderContainer, StyledButton, TooltipText } from './index.style';
import { IPOFilter, IPOs } from './types';
import React, { useEffect, useReducer, useRef, useState } from 'react';

import { Canceler } from 'axios';
import Dropdown from '@procosys/components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import InvitationsFilter from './Filter';
import InvitationsTable from './Table';
import { ProjectDetails } from '@procosys/modules/InvitationForPunchOut/types';
import { SelectItem } from '@procosys/components/Select';
import Spinner from '@procosys/components/Spinner';
import { Tooltip } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';

//TODO: create todos

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


const SearchIPO = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(25);
    const [filter, setFilter] = useState<IPOFilter>({ ...emptyFilter });
    const [resetTablePaging, setResetTablePaging] = useState<boolean>(false);
    const { apiClient } = useInvitationForPunchOutContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [project, setProject] = useState<ProjectDetails>();
    const [filterForProjects, setFilterForProjects] = useState<string>('');

    const isFirstRender = useRef<boolean>(true);
    const [update, forceUpdate] = useReducer(x => x + 1, 0); // Used to force an update on table
    const [filterUpdate, forceFilterUpdate] = useReducer(x => x + 1, 0); // Used to force update on table with filter change

    const [numberOfIPOs, setNumberOfIPOs] = useState<number>(10);
    const numberOfFilters: number = Object.values(filter).filter(v => v && JSON.stringify(v) != '[]').length;

    const cancelerRef = useRef<Canceler | null>();

    const [availableRoles, setAvailableRoles] = useState<SelectItem[]>([]);

    /**
     * Fetch available functional roles 
     */
    useEffect(() => {
        let requestCanceler: Canceler;
        try {
            (async (): Promise<void> => {
                const functionalRoles = await apiClient.getFunctionalRolesAsync((cancelerCallback) => requestCanceler = cancelerCallback);
                setAvailableRoles(functionalRoles.map((role): SelectItem => {
                    return ({
                        text: role.code,
                        value: role.code
                    });
                }));
            })();
            return (): void => requestCanceler && requestCanceler();
        } catch (error) {
            showSnackbarNotification(error.message);
        }
    }, []);


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
    }, [moduleHeaderContainerRef, displayFilter]);

    useEffect(() => {
        window.addEventListener('resize', updateModuleHeaderHeightReference);

        return (): void => {
            window.removeEventListener('resize', updateModuleHeaderHeightReference);
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


    const getIPOs = async (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null): Promise<IPOs> => {
        if (project) {  //to avoid getting ipos before we have set previous-/default filter (include savedFilters if used)
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
        return { maxAvailable: 0, invitations: [] };
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
                    <Tooltip placement={'left'} title={<TooltipText><p>{numberOfFilters} active filter(s)</p><p>Filter result {numberOfIPOs} items</p></TooltipText>} disableHoverListener={numberOfFilters < 1} arrow={true} style={{ textAlign: 'center' }}>
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
                    projectName={project?.name}
                    height={moduleAreaHeight - moduleHeaderHeight - 100}
                    update={update}
                    filterUpdate={filterUpdate}
                />


            </ContentContainer >
            {
                displayFilter && (
                    <FilterContainer maxHeight={moduleAreaHeight}>
                        <InvitationsFilter
                            project={project}
                            onCloseRequest={(): void => {
                                setDisplayFilter(false);
                            }}
                            filter={filter} setFilter={setFilter}
                            roles={availableRoles}
                            numberOfIPOs={numberOfIPOs}
                        />
                    </FilterContainer>
                )
            }
        </Container >

    );
};

export default SearchIPO;
