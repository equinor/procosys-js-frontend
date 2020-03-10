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
import { PreservedTag } from './types';
import ScopeTable from './ScopeTable';
import TransferDialog from './TransferDialog';

const ScopeOverview: React.FC = (): JSX.Element => {
    const [startPreservationDisabled, setStartPreservationDisabled] = useState(true);
    const [preservedThisWeekDisabled, setPreservedThisWeekDisabled] = useState(true);
    const [tags, setTags] = useState<PreservedTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<PreservedTag[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);
    const [flyoutTagId, setFlyoutTagId] = useState<number>(0);
    const [scopeIsDirty, setScopeIsDirty] = useState<boolean>(false);

    const path = useRouteMatch();

    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
    } = usePreservationContext();

    const getTags = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const tags = await apiClient.getPreservedTags(project.name);
            setTags(tags);
        } catch (error) {
            console.error('Get tags failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        (async (): Promise<void> => {
            getTags();
        })();
    }, [project]);

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setCurrentProject(availableProjects[index].id);
    };

    const startPreservation = async (): Promise<void> => {
        try {
            await apiClient.startPreservation(selectedTags.map(t => t.id));
            setSelectedTags([]);
            getTags().then(() => {
                showSnackbarNotification('Status was set to \'Active\' for selected tags.', 5000);
            });
        } catch (error) {
            console.error('Start preservation failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        return Promise.resolve();
    };

    const transfer = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await apiClient.transfer(selectedTags.map(t => t.id));
            setSelectedTags([]);
            getTags().then(() => {
                showSnackbarNotification(`${selectedTags.length} tags has been transferd successfully.`, 5000);
            });
        } catch (error) {
            console.error('Transfer failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
        return Promise.resolve();
    };

    const transferDialog = (): void => {
        //Verify that all selected tags can be transfered
        // const numTagsNotTransferable = selectedTags.filter((tag) => !tag.readyToBeTransferred).length;
        // if (numTagsNotTransferable == 0) {
        showModalDialog(
            `${selectedTags.length} selected tags. Please confirm to transfer all selected tags, or go back to list.`,
            <TransferDialog selectedTags={selectedTags} />,
            '800px',
            'Back to list',
            null,
            'Transfer',
            transfer);
        // } else {
        //     showModalDialog(
        //`${numTagsNotTransferable} tag(s) are not transferable.`, null, '300px', 'Back to list');
        // }
    };

    const preservedThisWeek = async (): Promise<void> => {
        try {
            await apiClient.preserve(selectedTags.map(t => t.id));
            setSelectedTags([]);
            getTags().then(() => {
                showSnackbarNotification('Selected tags have been preserved for this week.', 5000);
            });
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
            getTags();
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
        }, [selectedTags]);

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
        }, [selectedTags]);

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
                tags={tags}

                isLoading={isLoading}
                setSelectedTags={setSelectedTags}
                showTagDetails={openFlyout}
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
