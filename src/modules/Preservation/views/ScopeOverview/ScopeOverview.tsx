import React, { useMemo, useState } from 'react';
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

const ScopeOverview: React.FC = (): JSX.Element => {
    const [startPreservationDisabled, setStartPreservationDisabled] = useState(
        true
    );

    const [tags, setTags] = useState<PreservedTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const path = useRouteMatch();
    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
    } = usePreservationContext();

    async function getPreservedTags(): Promise<void> {
        const tags = await apiClient.getPreservedTags();
        setTags(tags);
    }

    useMemo(getPreservedTags, []);

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        setCurrentProject(availableProjects[index].id);
    };

    const startPreservation = (): void => {
        console.log('Start preservation for selected tags.' + selectedTags);
        apiClient.startPreservation(selectedTags);
        getPreservedTags();
        setStartPreservationDisabled(true); //after rendring, tags are unselected, but onSelectionChange is not called
    };

    const onSelectionHandler = (selectedTags: any): void => {
        const selected: string[] = [];
        let enableStartPreservation = true;
        if (selectedTags.length === 0) {
            enableStartPreservation = false;
        } else {
            selectedTags.forEach((element: PreservedTag) => {
                selected.push(element.id);
                if (
                    enableStartPreservation &&
                    element.status !== 'NotStarted'
                ) {
                    enableStartPreservation = false;
                }
            });
        }
        setStartPreservationDisabled(!enableStartPreservation);
        console.log('Set selected tags: ' + selected);
        setSelectedTags(selected);
    };

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
                    { title: 'Next', field: 'next' },
                    //{ title: 'OS', field: 'os' },
                    { title: 'PO nr', field: 'purchaseOrderNo' },
                    { title: 'Area', field: 'areaCode' },
                    { title: 'Resp', field: 'responsible' },
                    { title: 'Disc', field: 'disciplineCode' },
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
