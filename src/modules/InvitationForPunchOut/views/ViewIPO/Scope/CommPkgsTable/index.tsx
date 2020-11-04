import { Container, CustomTable } from './style';

import { CommPkg } from '../types';
import React from 'react';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';

const { Head, Body, Cell, Row } = Table;

interface Props {
    commPkgs: CommPkg[];
}

const CommPkgsTable = ({ commPkgs }: Props ): JSX.Element => {
    const openCommPkg = async (id: number): Promise<void> => { Promise.resolve(null); };
 
    return (
        <Container>
            <CustomTable>
                <Head>
                    <Row>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Comm pkg no.</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Comm pkg descripton</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Comm pkg status</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Punch status</Cell>
                    </Row>
                </Head>
                <Body>
                    {commPkgs && commPkgs.length > 0 && commPkgs.map((commPkg: CommPkg, index: number) => (
                        <Row key={index} as="tr">
                            <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                <Typography onClick={(): Promise<void> => openCommPkg(commPkg.id)} variant="body_short" link>{commPkg.commPkgNo}</Typography>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{commPkg.description}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{commPkg.status}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{commPkg.punchStatus}</Cell>
                        </Row>
                    ))}
                </Body>
            </CustomTable> 
        </Container>
    );
};

export default CommPkgsTable;

