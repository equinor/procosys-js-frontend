import { Container, Header } from './ScopeOverview.style';
import React, { useMemo } from 'react';

import { Select } from '../../../../components';
import { SelectItem } from '../../../../components/Select';
import { usePreservationContext } from '../../context/PreservationContext';

import { Button } from '@equinor/eds-core-react';

const ScopeOverview: React.FC = (): JSX.Element => {

    const { project, availableProjects, setCurrentProject } = usePreservationContext();

    const projectSelectOptions = useMemo(() => {
        return availableProjects.map(project => {
            return {
                text: project.description,
                value: project.id
            };
        });
    }, [availableProjects]);

    const changeProject = (project: SelectItem): void => {
        setCurrentProject(project.value as number);
    };

    return (
        <Container>
            <Header>
                <h1>Preservation tags</h1>
                <Select data={projectSelectOptions} selected={{ text: project.description, value: project.id }} onChange={changeProject} />
            </Header>
            <h3>{project.description}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Tag No</th>
                        <th>Tag Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>T-2000-HDF</td>
                        <td>This is a tag</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>T-1000-SJD</td>
                        <td>This is a tag</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>T-1000-SJD</td>
                        <td>This is a tag</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>T-1000-SJD</td>
                        <td>This is a tag</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><Button onClick={(): void => alert('ohoi')}>Primary EDS</Button></td>
                        <td><Button color="secondary">Secondary EDS</Button></td>
                        <td><Button disabled>Disabled EDS</Button></td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><Button color="danger">Danger EDS</Button></td>
                        <td><Button variant="outlined">Outlined EDS</Button></td>
                        <td><Button variant="ghost">Ghost EDS</Button></td>
                    </tr>
                </tbody>
            </table>
        </Container>
    );
};

export default ScopeOverview;
