import { Container, CustomTable } from './style';
import { Table, Typography } from '@equinor/eds-core-react';

import { McPkgScope } from '../../types';
import React from 'react';

const { Head, Body, Cell, Row } = Table;

interface Props {
    mcPkgScope: McPkgScope[];
}

const McPkgsTable = ({ mcPkgScope }: Props ): JSX.Element => {
    const getMcPkg = async (id: string): Promise<void> => { Promise.resolve(null); };
 
    return (
        <Container>
            <CustomTable>
                <Head>
                    <Row>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>MC pkg no.</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>MC pkg description</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Comm pkg no.</Cell>
                    </Row>
                </Head>
                <Body>
                    {mcPkgScope.length > 0 ? mcPkgScope.map((mcPkg: McPkgScope, index: number) => (
                        <Row key={index} as="tr">
                            <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                <Typography onClick={(): Promise<void> => getMcPkg(mcPkg.mcPkgNo)} variant="body_short" link>{mcPkg.mcPkgNo}</Typography>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{mcPkg.description}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{mcPkg.commPkgNo}</Cell>
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

export default McPkgsTable;
