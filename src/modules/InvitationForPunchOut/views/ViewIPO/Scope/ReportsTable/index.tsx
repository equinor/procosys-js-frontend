import { Container, CustomTable } from './style';
import React, { useState } from 'react';

import EdsIcon from '@procosys/components/EdsIcon';
import { Project } from '../types';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';

const { Head, Body, Cell, Row } = Table;

interface Props {
    projects: Project[];
}

const ReportsTable = ({ projects }: Props ): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);

    const openProject = async (id: number): Promise<void> => { Promise.resolve(null); };

 
    return (
        <Container>
            <CustomTable>
                <Head>
                    <Row>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Report</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>{' '}</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>{' '}</Cell>
                    </Row>
                </Head>
                <Body>
                    {projects && projects.length > 0 && projects.map((project: Project, index: number) => (
                        <Row key={index} as="tr">
                            <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                <Typography onClick={(): Promise<void> => openProject(project.id)} variant="body_short" link>{project.name}</Typography>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{project.description}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{loading ? <Spinner /> : <EdsIcon color='#007079' name="iphone" />}</Cell>
                        </Row>
                    ))}
                </Body>
            </CustomTable> 
        </Container>
    );
};

export default ReportsTable;

