import React, { useMemo } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import { Container, Header } from './ScopeOverview.style';
import { Select } from '../../../../components';
import { SelectItem } from '../../../../components/Select';
import Dropdown from '../../../../components/Dropdown';
import Table from './../../../../components/Table';
import { usePreservationContext } from '../../context/PreservationContext';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';

const ScopeOverview: React.FC = (): JSX.Element => {
    const path = useRouteMatch();
    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
    } = usePreservationContext();

    const projectSelectOptions = useMemo(() => {
        return availableProjects.map(project => {
            return {
                text: project.description,
                value: project.id,
            };
        });
    }, [availableProjects]);

    useMemo(async () => {
        const tags = await apiClient.getTags();
        console.log('Tags: ', tags);
    }, []);

    const changeProject = (project: SelectItem): void => {
        setCurrentProject(project.value as number);
        showSnackbarNotification('æest' + project.value, 3000);
    };

    return (
        <Container>
            <Header>
                <h1>Preservation tags</h1>
                <Select
                    data={projectSelectOptions}
                    selected={{ text: project.description, value: project.id }}
                    onChange={changeProject}
                />
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
            <Table
                columns={[
                    { title: 'Tag nr', field: 'tagno' },
                    { title: 'Description', field: 'description' },
                    { title: 'Next', field: 'nextpreservation' },
                    { title: 'OS', field: 'os' },
                    { title: 'POnr', field: 'pono' },
                    { title: 'Area', field: 'area' },
                    { title: 'Resp', field: 'responsible' },
                    { title: 'Disc', field: 'disc' },
                    { title: 'Status', field: 'status' },
                ]}
                data={[
                    {
                        tagno: '20CJ009-M01',
                        description: 'RETURN CIRCULATION PUMP - MOTOR',
                        nextpreservation: '2019W26',
                        os: 0,
                        pono: 'AB123',
                        area: 'A123',
                        responsible: 'AIGPH',
                        disc: 'A',
                        status: 'Active',
                    },
                ]}
                options={{
                    showTitle: false,
                    selection: true,
                }}
                onSelectionChange={(test): void =>
                    console.log('Selection changed: ', test)
                }
                style={{ boxShadow: 'none' }}
            />
        </Container>
    );
};

export default ScopeOverview;
