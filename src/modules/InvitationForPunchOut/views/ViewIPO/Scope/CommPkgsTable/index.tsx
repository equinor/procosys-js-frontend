import { Container, CustomTable } from './style';

import { CommPkgScope } from '../../types';
import React from 'react';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';

const { Head, Body, Cell, Row } = Table;

interface Props {
    commPkgScope: CommPkgScope[];
}

const CommPkgsTable = ({ commPkgScope }: Props ): JSX.Element => {
    const getCommPkg = async (id: string): Promise<void> => { Promise.resolve(null); };
 
    return (
        <Container>
            <CustomTable>
                <Head>
                    <Row>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Comm pkg no.</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Comm pkg description</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Comm pkg status</Cell>
                    </Row>
                </Head>
                <Body>
                    {commPkgScope && commPkgScope.length > 0 ? commPkgScope.map((commPkg: CommPkgScope, index: number) => (
                        <Row key={index} as="tr">
                            <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                <Typography onClick={(): Promise<void> => getCommPkg(commPkg.commPkgNo)} variant="body_short" link>{commPkg.commPkgNo}</Typography>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{commPkg.description}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{commPkg.status}</Cell>
                        </Row>
                    )) : (
                        <Row>
                            <Cell style={{verticalAlign: 'middle', width: '100%'}}><Typography style={{textAlign: 'center'}} variant="body_short">Nothing to display</Typography></Cell>
                        </Row>
                    )}
                </Body>
            </CustomTable> 
        </Container>
    );
};

export default CommPkgsTable;
