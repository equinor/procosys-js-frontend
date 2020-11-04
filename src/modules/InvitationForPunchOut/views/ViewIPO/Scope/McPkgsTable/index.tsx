import { Container, CustomTable } from './style';

import { McPkg } from '../types';
import React from 'react';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';

const { Head, Body, Cell, Row } = Table;

interface Props {
    mcPkgs: McPkg[];
}

const McPkgsTable = ({ mcPkgs }: Props ): JSX.Element => {
    const openMcPkg = async (id: number): Promise<void> => { Promise.resolve(null); };
 
    return (
        <Container>
            <CustomTable>
                <Head>
                    <Row>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>MC pkg no.</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>MC pkg descripton</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>MC pkg status</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Punch status</Cell>
                    </Row>
                </Head>
                <Body>
                    {mcPkgs && mcPkgs.length > 0 && mcPkgs.map((mcPkg: McPkg, index: number) => (
                        <Row key={index} as="tr">
                            <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                <Typography onClick={(): Promise<void> => openMcPkg(mcPkg.id)} variant="body_short" link>{mcPkg.mcPkgNo}</Typography>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{mcPkg.description}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{mcPkg.disciplineCode}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{mcPkg.punchStatus}</Cell>
                        </Row>
                    ))}
                </Body>
            </CustomTable> 
        </Container>
    );
};

export default McPkgsTable;

