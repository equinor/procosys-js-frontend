import {
    Container,
    DropdownItem,
    Header,
    HeaderContainer,
    IconBar,
    TableToolbar,
    TagLink
} from './ScopeOverview.style';
import { Link, useRouteMatch } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import CompareArrowsOutlinedIcon from '@material-ui/icons/CompareArrowsOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Dropdown from '../../../../components/Dropdown';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import Table from './../../../../components/Table';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { usePreservationContext } from '../../context/PreservationContext';
import TagFlyout from './TagFlyout/TagFlyout';

interface PreservedTag {
    id: number;
    tagNo: string;
    description: string;
    mode: string;
    areaCode: string;
    calloffNo: string;
    commPkgNo: string;
    disciplineCode: string;
    isAreaTag: boolean;
    isVoided: boolean;
    mcPkgNo: string;
    purchaseOrderNo: string;
    status: string;
    tagFunctionCode: string;
    responsibleCode: string;
    remark: string;
    readyToBePreserved: boolean;
    firstUpcomingRequirement: {
        nextDueAsYearAndWeek: string;
        nextDueWeeks: number;
    };
}

const ScopeOverview: React.FC = (): JSX.Element => {
    const [startPreservationDisabled, setStartPreservationDisabled] = useState(true);
    const [preservedThisWeekDisabled, setPreservedThisWeekDisabled] = useState(true);
    const [tags, setTags] = useState<PreservedTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<PreservedTag[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);
    const [flyoutTagNo, setFlyoutTagNo] = useState<string>('');

    const path = useRouteMatch();

    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
    } = usePreservationContext();

    const getTags = async (): Promise<void> => {
        setIsLoading(true);
        const tags = await apiClient.getPreservedTags(project.name);
        setTags(tags);
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

    const startPreservation = (): void => {
        apiClient.startPreservation(selectedTags.map(t => t.id)).then(
            () => {
                setSelectedTags([]);
                getTags().then(
                    () => {
                        showSnackbarNotification(
                            'Status was set to \'Active\' for selected tags.',
                            5000
                        );
                    }
                );
            }
        );
    };

    const preservedThisWeek = (): void => {
        apiClient.preserve(selectedTags.map(t => t.id)).then(
            () => {
                setSelectedTags([]);
                getTags().then(
                    () => {
                        showSnackbarNotification(
                            'Selected tags have been preserved for this week.',
                            5000
                        );
                    }
                );
            }
        );
    };

    const onSelectionHandler = (selectedTags: PreservedTag[]): void => {
        setSelectedTags(selectedTags);
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

    const getTagNoColumn = (tag: PreservedTag): JSX.Element => {
        return (
            <TagLink 
                onClick={(): void => {
                    setFlyoutTagNo(tag.tagNo);
                    setDisplayFlyout(true);
                }}
            >
                {tag.tagNo}
            </TagLink> 
        );
    };

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
                        <Link to={'/AddScope'}>
                            <DropdownItem>
                                Add tags manually
                            </DropdownItem>
                        </Link>
                        <Link to={`${path.url}`}>
                            <DropdownItem>
                                Generate scope by Tag Function
                            </DropdownItem>
                        </Link>
                        <Link to={`${path.url}`}>
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
                    <IconButton
                        onClick={(): void => {
                            startPreservation();
                        }}
                        disabled={startPreservationDisabled}>
                        <PlayArrowOutlinedIcon />
                    </IconButton>
                    <IconButton
                        disabled>
                        <CompareArrowsOutlinedIcon />
                    </IconButton>
                    <IconButton
                        disabled={true}>
                        <CreateOutlinedIcon />
                    </IconButton>
                    <IconButton
                        disabled={true}>
                        <DeleteOutlinedIcon />
                    </IconButton>
                    <IconButton
                        disabled={true}>
                        <PrintOutlinedIcon />
                    </IconButton>
                </IconBar>
            </HeaderContainer>
            <Table
                columns={[
                    { 
                        title: 'Tag nr', 
                        field: 'tagNo',
                        render: (tag: PreservedTag): JSX.Element => getTagNoColumn(tag)                                              
                    },
                    { title: 'Description', field: 'description' },
                    { title: 'Next', field: 'firstUpcomingRequirement.nextDueAsYearAndWeek' },
                    { title: 'Due', field: 'firstUpcomingRequirement.nextDueWeeks' },
                    { title: 'PO nr', field: 'purchaseOrderNo' },
                    { title: 'Area', field: 'areaCode' },
                    { title: 'Resp', field: 'responsibleCode' },
                    { title: 'Disc', field: 'disciplineCode' },
                    { title: 'Status', field: 'status' },
                ]}
                data={tags}
                options={{
                    showTitle: false,
                    draggable: false,
                    selection: true,
                    pageSize: 10,
                    pageSizeOptions: [10, 50, 100],
                    headerStyle: {
                        backgroundColor: '#f7f7f7'
                    },
                    rowStyle: (rowData): any => ({
                        color: rowData.firstUpcomingRequirement?.nextDueWeeks < 0 && tokens.colors.interactive.danger__text.rgba,
                        backgroundColor: rowData.tableData.checked && '#EAEAEA'
                    }),
                }}
                components={{
                    Toolbar: (data): any => (
                        <TableToolbar>{data.selectedRows.length} tags selected</TableToolbar>
                    )
                }}
                isLoading={isLoading}
                onSelectionChange={onSelectionHandler}
                style={{ boxShadow: 'none' }}
            />
            <TagFlyout 
                displayFlyout={displayFlyout} 
                setDisplayFlyout={setDisplayFlyout}
                tagNo={flyoutTagNo}
            />
        </Container>
    );
};

export default ScopeOverview;
