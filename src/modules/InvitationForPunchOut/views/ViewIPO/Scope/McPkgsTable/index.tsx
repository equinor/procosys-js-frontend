import { Container, CustomTable } from './style';
import { Table, Typography } from '@equinor/eds-core-react';

import { McPkgScope } from '../../types';
import React from 'react';
import { useCurrentPlant } from '@procosys/core/PlantContext';

const { Head, Body, Cell, Row } = Table;

interface Props {
    mcPkgScope: McPkgScope[];
    projectName: string;
}

const McPkgsTable = ({ mcPkgScope, projectName }: Props ): JSX.Element => {
    const { plant } = useCurrentPlant();

    const goToMcPkg = (mcPkgNo: string): void => {
        window.location.href = `/${plant.pathId}/Completion#McPkg|?projectName=${projectName}&mcpkgno=${mcPkgNo}`;
    };

    const goToCommPkg = (commPkgNo: string): void => {
        window.location.href = `/${plant.pathId}/Completion#CommPkg|?projectName=${projectName}&commpkgno=${commPkgNo}`;
    };
 
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
                                <Typography onClick={(): void => goToMcPkg(mcPkg.mcPkgNo)} variant="body_short" link>{mcPkg.mcPkgNo}</Typography>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{mcPkg.description}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                <Typography onClick={(): void => goToCommPkg(mcPkg.commPkgNo)} variant="body_short" link>{mcPkg.commPkgNo}</Typography>
                            </Cell>
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
