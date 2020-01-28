import React, { useState, useEffect } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import {
    Container,
    HeaderContainer,
    Header,
    IconBar,
} from './ScopeOverview.style';
import Dropdown from '../../../../components/Dropdown';
import Table from './../../../../components/Table';
import { usePreservationContext } from '../../context/PreservationContext';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import CompareArrowsOutlinedIcon from '@material-ui/icons/CompareArrowsOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import IconButton from '@material-ui/core/IconButton';
import { PreservedTag } from './types';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';

const ScopeOverview: React.FC = (): JSX.Element => {
    const [startPreservationDisabled, setStartPreservationDisabled] = useState(
        true
    );

    const [tags, setTags] = useState<PreservedTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<PreservedTag[]>([]);

    const path = useRouteMatch();

    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
    } = usePreservationContext();

    const getTags = async (): Promise<void> => {
        const tags = await apiClient.getPreservedTags(project.name);
        setTags(tags);
    };

    useEffect(() => {
        (async (): Promise<void> => {
            getTags();
        })();
    }, []);

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setCurrentProject(availableProjects[index].id);
    };


    const startPreservation = (): void => {
        console.log('Start preservation for selected tags.', selectedTags);
        apiClient.startPreservation(selectedTags.map(t => t.id)).then(
            () => {
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
        }
    );

    return (
        <Container>
            <HeaderContainer>
                <Header>
                    <h1>Preservation tags</h1>
                    <Dropdown text={project.description}>
                        {availableProjects.map((projectItem, index) => {
                            return (
                                <a
                                    href="#"
                                    key={index}
                                    onClick={(event): void =>
                                        changeProject(event, index)
                                    }
                                >
                                    {projectItem.description}
                                </a>
                            );
                        })}
                    </Dropdown>

                    <Dropdown text="Add scope">
                        <NavLink to={`${path.url}/AddScope`}>
                            Add tags manually
                        </NavLink>
                        <NavLink to={`${path.url}`}>
                            Generate scope by Tag Function
                        </NavLink>
                        <NavLink to={`${path.url}`}>Create area tag</NavLink>
                    </Dropdown>
                </Header>
                <IconBar>
                    <IconButton
                        onClick={(): void => {
                            startPreservation();
                        }}
                        disabled={startPreservationDisabled}
                    >
                        <PlayArrowOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <CompareArrowsOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <CreateOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <DeleteOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <PrintOutlinedIcon />
                    </IconButton>
                </IconBar>
            </HeaderContainer>
            <Table
                columns={[
                    { title: 'Tag nr', field: 'tagNo' },
                    { title: 'Description', field: 'description' },
                    { title: 'Next', field: 'firstUpcomingRequirement.nextDueAsYearAndWeek' },
                    { title: 'Due time', field: 'firstUpcomingRequirement.nextDueWeeks' },
                    { title: 'PO nr', field: 'purchaseOrderNo' },
                    { title: 'Area', field: 'areaCode' },
                    { title: 'Responsible', field: 'responsibleCode' },
                    { title: 'Discipline', field: 'disciplineCode' },
                    { title: 'Status', field: 'status' },
                ]}

                data={tags}
                options={{
                    showTitle: false,
                    selection: true,
                }}
                onSelectionChange={onSelectionHandler}
                style={{ boxShadow: 'none' }}
            />
        </Container>
    );
};

export default ScopeOverview;
