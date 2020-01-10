import { Container, Header } from './ScopeOverview.style';
import React, {useMemo} from 'react';

import { Select } from '../../../../components';
import { SelectItem } from '../../../../components/Select';
import Table from './../../../../components/Table';
import { usePreservationContext } from '../../context/PreservationContext';

const ScopeOverview: React.FC = (): JSX.Element => {

    const {project, availableProjects, setCurrentProject} = usePreservationContext();

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
                <Select data={projectSelectOptions} selected={{text: project.description, value: project.id}} onChange={changeProject} />
            </Header>
            <h3>{project.description}</h3>
            <Table columns={[
                {title: 'Test', field: 'name'}
            ]}
            data={[
                {name: 'Hello'}
            ]}/>
        </Container>
    );
};

export default ScopeOverview;
