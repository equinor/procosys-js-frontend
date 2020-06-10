
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@equinor/eds-core-react';
import FastForwardOutlinedIcon from '@material-ui/icons/FastForwardOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';
import { Container, DropdownItem, Header, HeaderContainer, IconBar, StyledButton, FilterDivider, ContentContainer, FilterContainer, TooltipText } from './ScopeOverview.style';
import Dropdown from '../../../../components/Dropdown';
import OptionsDropdown from '../../../../components/OptionsDropdown';
import Flyout from './../../../../components/Flyout';
import TagFlyout from './TagFlyout/TagFlyout';
import { showModalDialog } from '../../../../core/services/ModalDialogService';
import { PreservedTag, Requirement, PreservedTags, TagListFilter } from './types';
import ScopeTable from './ScopeTable';
import TransferDialog from './TransferDialog';
import PreservedDialog from './PreservedDialog';
import StartPreservationDialog from './StartPreservationDialog';
import ScopeFilter from './ScopeFilter/ScopeFilter';
import EdsIcon from '../../../../components/EdsIcon';
import { tokens } from '@equinor/eds-tokens';
import CompleteDialog from './CompleteDialog';
import {Tooltip } from '@material-ui/core';
import VoidDialog from './VoidDialog';

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

export const isTagVoided = (tag: PreservedTag): boolean => {
    return tag.isVoided;
};

const backToListButton = 'Back to list';

const ScopeOverview: React.FC = (): JSX.Element => {
    const [selectedTags, setSelectedTags] = useState<PreservedTag[]>([]);
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState<boolean>(false);
    const [flyoutTagId, setFlyoutTagId] = useState<number>(0);
    const [scopeIsDirty, setScopeIsDirty] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(50);
    const [tagListFilter, setTagListFilter] = useState<TagListFilter>({
        tagNoStartsWith: null,
        commPkgNoStartsWith: null,
        mcPkgNoStartsWith: null,
        purchaseOrderNoStartsWith: null,
        storageAreaStartsWith: null,
        preservationStatus: null,
        actionStatus: null,
        journeyIds: [],
        modeIds: [],
        dueFilters: [],
        requirementTypeIds: [],
        tagFunctionCodes: [],
        disciplineCodes: [],
        responsibleIds: [],
        areaCodes: []
    });

    const [numberOfTags, setNumberOfTags] = useState<number>();
    const [voidedTagsSelected, setVoidedTagsSelected] = useState<boolean>();
    const [unVoidedTagsSelected, setUnVoidedTagsSelected] = useState<boolean>();

    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
    } = usePreservationContext();
    const [numberOfFilters, setNumberOfFilters] = useState<number>(0);

    const refreshScopeListCallback = useRef<() => void>();

    const refreshScopeList = (): void => {
        refreshScopeListCallback.current && refreshScopeListCallback.current();
    };

    useEffect(
        () => {
            refreshScopeList();
        }, [tagListFilter]
    );

    useEffect(() => {
        setVoidedTagsSelected(selectedTags.find(t => t.isVoided) ? true : false);        
        setUnVoidedTagsSelected(selectedTags.find(t => !t.isVoided) ? true : false);        

    }, [selectedTags]);

    const setRefreshScopeListCallback = (callback: () => void): void => {
        refreshScopeListCallback.current = callback;
    };

    const getTags = async (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null): Promise<PreservedTags> => {
        try {
            return await apiClient.getPreservedTags(project.name, page, pageSize, orderBy, orderDirection, tagListFilter).then(
                (response) => {
                    setNumberOfTags(response.maxAvailable);
                    return response;
                }
            );
        } catch (error) {
            console.error('Get tags failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return { maxAvailable: 0, tags: [] };
    };

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setCurrentProject(availableProjects[index].id);
    };

    let transferableTags: PreservedTag[];
    let nonTransferableTags: PreservedTag[];

    const transfer = async (): Promise<void> => {
        try {
            await apiClient.transfer(transferableTags.map(t => ({
                id: t.id,
                rowVersion: t.rowVersion
            })));
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
            backToListButton,
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
            backToListButton,
            null,
            startButton,
            startFunc);
    };

    let preservableTags: PreservedTag[];
    let nonPreservableTags: PreservedTag[];

    const preservedThisWeek = async (): Promise<void> => {
        try {
            await apiClient.preserve(preservableTags.map(t => t.id));
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification('Selected tag(s) have been preserved for this week.');
        } catch (error) {
            console.error('Preserve failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const preservedDialog = (): void => {
        preservableTags = [];
        nonPreservableTags = [];

        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBePreserved) {
                preservableTags.push(newTag);
            } else {
                nonPreservableTags.push(newTag);
            }
        });

        const preservedButton = preservableTags.length > 0 ? 'Preserved this week' : null;
        const preservedFunc = preservableTags.length > 0 ? preservedThisWeek : null;

        showModalDialog(
            'Preserved This Week',
            <PreservedDialog preservableTags={preservableTags} nonPreservableTags={nonPreservableTags} />,
            '80vw',
            backToListButton,
            null,
            preservedButton,
            preservedFunc);
    };

    let completableTags: PreservedTag[] = [];
    let nonCompletableTags: PreservedTag[] = [];

    const complete = async (): Promise<void> => {
        try {
            const tags = selectedTags.filter(tag => tag.readyToBeCompleted);
            await apiClient.complete(tags.map(t => ({
                id: t.id,
                rowVersion: t.rowVersion
            })));
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification('Selected tag(s) have been completed.');
        } catch (error) {
            console.error('Complete failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const showCompleteDialog = (): void => {
        completableTags = [];
        nonCompletableTags = [];

        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBeCompleted) {
                completableTags.push(newTag);
            } else {
                nonCompletableTags.push(newTag);
            }
        });
        const completeButton = completableTags.length > 0 ? 'Complete' : null;
        const completeFunc = completableTags.length > 0 ? complete : null;

        showModalDialog(
            'Complete Preservation',
            <CompleteDialog completableTags={completableTags} nonCompletableTags={nonCompletableTags} />,
            '80vw',
            backToListButton,
            null,
            completeButton,
            completeFunc);
    };

    let voidableTags: PreservedTag[] = [];
    let unVoidableTags: PreservedTag[] = [];

    const voidTags = (): Promise<void> => {
        try {
            const tags = selectedTags.filter(tag => !tag.isVoided);
            tags.forEach(async tag => {
                await apiClient.voidTag(tag.id, tag.rowVersion);
            });
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification('Selected tag(s) have been voided.');
        } catch (error) {
            console.error('Voiding failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const unVoidTags = async (): Promise<void> => {
        try {
            const tags = selectedTags.filter(tag => tag.isVoided);
            tags.forEach(async tag => {
                await apiClient.unvoidTag(tag.id, tag.rowVersion);
            });
            refreshScopeList();
            setSelectedTags([]);
            showSnackbarNotification('Selected tag(s) have been unvoided.');
        } catch (error) {
            console.error('Unvoid failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const showVoidDialog = (voiding: boolean): void => {
        voidableTags = [];
        unVoidableTags = [];
        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (!tag.isVoided && voiding) {
                voidableTags.push(newTag);
            } else if(tag.isVoided && !voiding) {
                unVoidableTags.push(newTag);
            }
        });
        const voidButton = voidableTags.length > 0 ? 'Void' : 'Unvoid';
        const voidFunc = voidableTags.length > 0 ? voidTags : unVoidTags;
        const voidTitle = voidableTags.length > 0 ? 'Voiding following tags' : 'Unvoiding following tags';

        showModalDialog(
            voidTitle,
            <VoidDialog tags={voidableTags.length > 0 ? voidableTags : unVoidableTags} voiding={voiding} />,
            '80vw',
            backToListButton,
            null,
            voidButton,
            voidFunc);
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

    return (
        <Container>
            <ContentContainer>
                <HeaderContainer>
                    <Header>
                        <h1>Preservation tags</h1>
                        <Dropdown text={project.name}>
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
                            <Link to={'/AddScope/selectTagsManual'}>
                                <DropdownItem>
                                    Add tags manually
                                </DropdownItem>
                            </Link>
                            <Link to={'/AddScope/selectTagsAutoscope'}>
                                <DropdownItem>
                                    Autoscope by Tag Function
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
                            onClick={preservedDialog}
                            disabled={selectedTags.length < 1}>Preserved this week
                        </Button>
                        <StyledButton
                            variant='ghost'
                            title='Start preservation for selected tag(s)'
                            onClick={startPreservationDialog}
                            disabled={selectedTags.length < 1}>
                            <PlayArrowOutlinedIcon className='iconNextToText' fontSize='small' />
                        Start
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            title="Transfer selected tag(s)"
                            onClick={transferDialog}
                            disabled={selectedTags.length < 1}>
                            <FastForwardOutlinedIcon className='iconNextToText' fontSize='small' />
                        Transfer
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            title="Complete selected tag(s)"
                            onClick={showCompleteDialog}
                            disabled={selectedTags.length < 1}>
                            <div className='iconNextToText' ><EdsIcon name='done_all' color={selectedTags.length < 1 ? tokens.colors.interactive.disabled__border.rgba : ''} /></div>
                        Complete
                        </StyledButton>
                        <OptionsDropdown 
                            text="More options" 
                            icon='more_verticle' 
                            variant='ghost' 
                            disabled={selectedTags.length < 1}>
                            <DropdownItem 
                                disabled={!voidedTagsSelected}
                                onClick={(e: any): any => !voidedTagsSelected ? e.preventDefault() : showVoidDialog(true)}>
                                <EdsIcon name='delete_forever' color={!voidedTagsSelected && tokens.colors.interactive.disabled__border.rgba} />
                                Void
                            </DropdownItem>
                            <DropdownItem 
                                disabled={!unVoidedTagsSelected}
                                onClick={(e: any): any => !unVoidedTagsSelected ? e.preventDefault() : showVoidDialog(false)}>
                                <EdsIcon name='restore_from_trash' color={!unVoidedTagsSelected && tokens.colors.interactive.disabled__border.rgba}/>
                                Unvoid
                            </DropdownItem>
                        </OptionsDropdown>
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
                        <Tooltip title={<TooltipText><p>{numberOfFilters} active filter(s)</p><p>Filter result {numberOfTags} items</p></TooltipText>} disableHoverListener={numberOfFilters < 1} arrow={true} style={{textAlign: 'center'}}>
                            <div>
                                <StyledButton
                                    variant={numberOfFilters > 0 ? 'contained' : 'ghost'}
                                    onClick={(): void => {
                                        toggleFilter();
                                    }}
                                >
                                    <EdsIcon name='filter_list' />
                                </StyledButton>
                            </div>
                        </Tooltip>
                    </IconBar>
                </HeaderContainer>

                <ScopeTable
                    getTags={getTags}
                    data-testId='scopeTable'
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
                        <FilterDivider />
                        <FilterContainer>
                            <ScopeFilter onCloseRequest={(): void => {
                                setDisplayFilter(false);
                            }} tagListFilter={tagListFilter} setTagListFilter={setTagListFilter} setNumberOfFilters={setNumberOfFilters} numberOfTags={numberOfTags} />
                        </FilterContainer>
                    </>
                )
            }
        </Container >
    );
};

export default ScopeOverview;
