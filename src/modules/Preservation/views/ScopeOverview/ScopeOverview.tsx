
import React, { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button } from '@equinor/eds-core-react';
import FastForwardOutlinedIcon from '@material-ui/icons/FastForwardOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';
import { Container, DropdownItem, Header, HeaderContainer, IconBar, StyledButton, FilterDivider, ContentContainer, FilterContainer } from './ScopeOverview.style';
import Dropdown from '../../../../components/Dropdown';
import Flyout from './../../../../components/Flyout';
import TagFlyout from './TagFlyout/TagFlyout';
import { showModalDialog } from '../../../../core/services/ModalDialogService';
import { PreservedTag, Requirement, PreservedTags, TagListFilter } from './types';
import ScopeTable from './ScopeTable';
import TransferDialog from './TransferDialog';
import StartPreservationDialog from './StartPreservationDialog';
import ScopeFilter from './ScopeFilter/ScopeFilter';

export const getFirstUpcomingRequirement = (tag: PreservedTag): Requirement | null => {
    if (!tag.requirements || tag.requirements.length === 0) {
        return null;
    }

    return tag.requirements[0];
};

export const isTagOverdue = (tag: PreservedTag): boolean => {
    const requirement = getFirstUpcomingRequirement(tag);
    return requirement ? requirement.nextDueWeeks < 0 : false;
};

const ScopeOverview: React.FC = (): JSX.Element => {
    const [preservedThisWeekDisabled, setPreservedThisWeekDisabled] = useState(true);
    const [selectedTags, setSelectedTags] = useState<PreservedTag[]>([]);
    //const [isLoading, setIsLoading] = useState<boolean>(false);     Is removed temporary. Causes problems with setting size of table.
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState<boolean>(false);
    const [flyoutTagId, setFlyoutTagId] = useState<number>(0);
    const [scopeIsDirty, setScopeIsDirty] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(50);
    const [tagListFilter, setTagListFilter] = useState<TagListFilter>({ tagNoStartsWith: null, commPkgNoStartsWith: null, mcPkgNoStartsWith: null, purchaseOrderNoStartsWith: null, storageAreaStartsWith: null, preservationStatus: null, actionStatus: null, journeyIds: [], modeIds: [], dueFilters: [], requirementTypeIds: [], tagFunctionCodes: [], disciplineCodes: [] });

    const path = useRouteMatch();

    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
    } = usePreservationContext();

    let refreshScopeList: () => void;

    const setRefreshScopeListCallback = (callback: () => void): void => {
        refreshScopeList = callback;
    };

    const getTags = async (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null): Promise<PreservedTags | null> => {
        try {
            return await apiClient.getPreservedTags(project.name, page, pageSize, orderBy, orderDirection, tagListFilter).then(
                (response) => {
                    return response;
                }
            );
        } catch (error) {
            console.error('Get tags failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return null;
    };

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setCurrentProject(availableProjects[index].id);
    };

    let transferableTags: PreservedTag[];
    let nonTransferableTags: PreservedTag[];

    const transfer = async (): Promise<void> => {
        try {
            await apiClient.transfer(transferableTags.map(t => t.id));
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification(`${transferableTags.length} tag(s) have been successfully transferred.`);
        } catch (error) {
            console.error('Transfer failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const transferDialog = (): void => {
        //Tag-objects must be cloned to avoid issues with data in scope table
        transferableTags = [];
        nonTransferableTags = [];

        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBeTransferred) {
                transferableTags.push(newTag);
            } else {
                nonTransferableTags.push(newTag);
            }
        });

        const transferButton = transferableTags.length > 0 ? 'Transfer' : null;
        const transferFunc = transferableTags.length > 0 ? transfer : null;

        showModalDialog(
            'Transferring',
            <TransferDialog transferableTags={transferableTags} nonTransferableTags={nonTransferableTags} />,
            '80vw',
            'Back to list',
            null,
            transferButton,
            transferFunc);
    };

    let startableTags: PreservedTag[];
    let nonStartableTags: PreservedTag[];

    const startPreservation = async (): Promise<void> => {
        try {
            await apiClient.startPreservation(startableTags.map(t => t.id));
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification('Status was set to \'Active\' for selected tag(s).');
        } catch (error) {
            console.error('Start preservation failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const startPreservationDialog = (): void => {
        startableTags = [];
        nonStartableTags = [];
        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBeStarted) {
                startableTags.push(newTag);
            } else {
                nonStartableTags.push(newTag);
            }
        });

        const startButton = startableTags.length > 0 ? 'Start Preservation' : null;
        const startFunc = startableTags.length > 0 ? startPreservation : null;

        showModalDialog(
            'Start Preservation',
            <StartPreservationDialog startableTags={startableTags} nonStartableTags={nonStartableTags} />,
            '80vw',
            'Back to list',
            null,
            startButton,
            startFunc);
    };

    const preservedThisWeek = async (): Promise<void> => {
        try {
            await apiClient.preserve(selectedTags.map(t => t.id));
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification('Selected tags have been preserved for this week.');
        } catch (error) {
            console.error('Preserve failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const openFlyout = (tag: PreservedTag): void => {
        setFlyoutTagId(tag.id);
        setDisplayFlyout(true);
    };

    const closeFlyout = (): void => {
        setDisplayFlyout(false);

        // refresh scope list when flyout has updated a tag
        if (scopeIsDirty) {
            refreshScopeList();
            setScopeIsDirty(false);
        }
    };

    const toggleFilter = (): void => {
        setDisplayFilter(!displayFilter);
    };

    /**
     * 'Preserved this week' button is set to disabled if no rows are selected or
     * if there are selected rows that are not raady to be preserved
     */
    useEffect(
        () => {
            setPreservedThisWeekDisabled(
                selectedTags.length === 0 ||
                selectedTags.findIndex((t) => t.readyToBePreserved !== true) !== -1
            );
        }, [selectedTags]
    );

    useEffect(
        () => {
            refreshScopeList();
        }, [tagListFilter]
    );

    return (
        <Container>
            <ContentContainer id='contentContaier'>
                <HeaderContainer id='headerContainer'>
                    <Header>
                        <h1>Preservation tags</h1>
                        <Dropdown text={project.description}>
                            {availableProjects.map((projectItem, index) => {
                                return (
                                    <DropdownItem
                                        key={index}
                                        onClick={(event): void =>
                                            changeProject(event, index)
                                        }
                                    >
                                        <div>{projectItem.description}</div>
                                        <div style={{ fontSize: '12px' }}>{projectItem.name}</div>
                                    </DropdownItem>
                                );
                            })}
                        </Dropdown>
                        <Dropdown text="Add scope">
                            <Link to={'/AddScope/selectTags'}>
                                <DropdownItem>
                                    Add tags manually
                                </DropdownItem>
                            </Link>
                            <Link to={`${path.url}`}>
                                <DropdownItem>
                                    Generate scope by Tag Function
                                </DropdownItem>
                            </Link>
                            <Link to={'/AddScope/createAreaTag'}>
                                <DropdownItem>
                                    Create area tag
                                </DropdownItem>
                            </Link>
                        </Dropdown>
                    </Header>
                    <IconBar id='iconBar'>
                        <Button
                            onClick={(): void => {
                                preservedThisWeek();
                            }}
                            disabled={preservedThisWeekDisabled}>Preserved this week
                        </Button>
                        <StyledButton
                            variant='ghost'
                            title='Start preservation for selected tag(s)'
                            onClick={startPreservationDialog}
                            disabled={selectedTags.length < 1}>
                            <PlayArrowOutlinedIcon fontSize='small' />
                        Start
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            title="Transfer selected tag(s)"
                            onClick={transferDialog}
                            disabled={selectedTags.length < 1}>
                            <FastForwardOutlinedIcon fontSize='small' />
                        Transfer
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            disabled={true}>
                            <CreateOutlinedIcon fontSize='small' />
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            disabled={true}>
                            <DeleteOutlinedIcon fontSize='small' />
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            disabled={true}>
                            <PrintOutlinedIcon fontSize='small' />
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            onClick={(): void => {
                                toggleFilter();
                            }}
                        >
                            <FilterListOutlinedIcon fontSize='small' />
                        </StyledButton>
                    </IconBar>
                </HeaderContainer>

                <ScopeTable
                    getTags={getTags}
                    //isLoading={isLoading}
                    setSelectedTags={setSelectedTags}
                    showTagDetails={openFlyout}
                    setRefreshScopeListCallback={setRefreshScopeListCallback}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                />
                {
                    displayFlyout && (
                        <Flyout
                            close={closeFlyout}>
                            <TagFlyout
                                tagId={flyoutTagId}
                                close={closeFlyout}
                                setDirty={(): void => setScopeIsDirty(true)}
                            />
                        </Flyout>
                    )
                }


            </ContentContainer >
            {
                displayFilter && (
                    <>
                        <FilterDivider id='filterDivider' />
                        <FilterContainer>
                            <ScopeFilter setDisplayFilter={setDisplayFilter} tagListFilter={tagListFilter} setTagListFilter={setTagListFilter} />
                        </FilterContainer>
                    </>
                )
            }
        </Container >
    );
};

export default ScopeOverview;
