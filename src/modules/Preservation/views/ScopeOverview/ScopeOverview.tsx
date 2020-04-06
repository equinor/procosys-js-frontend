
import React, { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button } from '@equinor/eds-core-react';
import FastForwardOutlinedIcon from '@material-ui/icons/FastForwardOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';
import { Container, DropdownItem, Header, HeaderContainer, IconBar, StyledButton } from './ScopeOverview.style';
import Dropdown from '../../../../components/Dropdown';
import Flyout from './../../../../components/Flyout';
import TagFlyout from './TagFlyout/TagFlyout';
import { showModalDialog } from '../../../../core/services/ModalDialogService';
import { PreservedTag, Requirement, PreservedTags } from './types';
import ScopeTable from './ScopeTable';
import TransferDialog from './TransferDialog';

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
    const [startPreservationDisabled, setStartPreservationDisabled] = useState(true);
    const [preservedThisWeekDisabled, setPreservedThisWeekDisabled] = useState(true);
    const [selectedTags, setSelectedTags] = useState<PreservedTag[]>([]);
    //const [isLoading, setIsLoading] = useState<boolean>(false);     Is removed temporary. Causes problems with setting size of table.
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);
    const [flyoutTagId, setFlyoutTagId] = useState<number>(0);
    const [scopeIsDirty, setScopeIsDirty] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(50);

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
            return await apiClient.getPreservedTags(project.name, page, pageSize, orderBy, orderDirection).then(
                (response) => {
                    return response;
                }
            );
        } catch (error) {
            console.error('Get tags failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        return null;
    };

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setCurrentProject(availableProjects[index].id);
    };

    const startPreservation = async (): Promise<void> => {
        try {
            await apiClient.startPreservation(selectedTags.map(t => t.id));
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification('Status was set to \'Active\' for selected tags.', 5000);
        } catch (error) {
            console.error('Start preservation failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        return Promise.resolve();
    };

    let transferableTags: PreservedTag[];
    let nonTransferableTags: PreservedTag[];

    const transfer = async (): Promise<void> => {
        try {
            await apiClient.transfer(transferableTags.map(t => t.id));
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification(`${transferableTags.length} tags have been successfully transferred.`, 5000);
        } catch (error) {
            console.error('Transfer failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
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
            '1000px',
            'Back to list',
            null,
            transferButton,
            transferFunc);
    };

    const preservedThisWeek = async (): Promise<void> => {
        try {
            await apiClient.preserve(selectedTags.map(t => t.id));
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification('Selected tags have been preserved for this week.', 5000);
        } catch (error) {
            console.error('Preserve failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
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

    /**
     * Start Preservation button is set to disabled if no rows are selected or
     * if there are selected rows with other status than NotStarted
     */
    useEffect(
        () => {
            setStartPreservationDisabled(
                selectedTags.length === 0 ||
                selectedTags.findIndex((t) => t.status !== 'NotStarted') !== -1
            );
        }, [selectedTags]
    );

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

    return (
        <Container>
            <HeaderContainer>
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
                <IconBar>
                    <Button
                        onClick={(): void => {
                            preservedThisWeek();
                        }}
                        disabled={preservedThisWeekDisabled}>Preserved this week
                    </Button>
                    <StyledButton
                        variant='ghost'
                        title='Start preservation for selected tag(s)'
                        onClick={(): void => {
                            startPreservation();
                        }}
                        disabled={startPreservationDisabled}>
                        <PlayArrowOutlinedIcon />
                    </StyledButton>
                    <StyledButton
                        variant='ghost'
                        title="Transfer selected tag(s)"
                        onClick={(): void => {
                            transferDialog();
                        }}
                        disabled={selectedTags.length < 1}>
                        <FastForwardOutlinedIcon />
                    </StyledButton>
                    <StyledButton
                        variant='ghost'
                        disabled={true}>
                        <CreateOutlinedIcon />
                    </StyledButton>
                    <StyledButton
                        variant='ghost'
                        disabled={true}>
                        <DeleteOutlinedIcon />
                    </StyledButton>
                    <StyledButton
                        variant='ghost'
                        disabled={true}>
                        <PrintOutlinedIcon />
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
        </Container >
    );
};

export default ScopeOverview;
