import { Container, CustomTable } from './style';
import { Table, Typography } from '@equinor/eds-core-react';

import { CommPkgScope } from '../../types';
import React from 'react';
import { useCurrentPlant } from '@procosys/core/PlantContext';

const { Head, Body, Cell, Row } = Table;

interface CommPkgsTableProps {
    commPkgScope: CommPkgScope[];
    projectName: string;
}

const CommPkgsTable = ({
    commPkgScope,
    projectName,
}: CommPkgsTableProps): JSX.Element => {
    const { plant } = useCurrentPlant();

    const getCommPkgUrl = (commPkgNo: string): string => {
        return `/${plant.pathId}/Completion#CommPkg|?projectName=${projectName}&commpkgno=${commPkgNo}`;
    };

    return (
        <Container>
            <CustomTable>
                <Head>
                    <Row>
                        <Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Comm pkg no.
                        </Cell>
                        <Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Comm pkg description
                        </Cell>
                        <Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Comm pkg status
                        </Cell>
                    </Row>
                </Head>
                <Body>
                    {commPkgScope.length > 0 ? (
                        commPkgScope.map(
                            (commPkg: CommPkgScope, index: number) => (
                                <Row key={index} as="tr">
                                    <Cell
                                        as="td"
                                        style={{
                                            verticalAlign: 'middle',
                                            lineHeight: '1em',
                                        }}
                                    >
                                        <Typography
                                            href={getCommPkgUrl(
                                                commPkg.commPkgNo
                                            )}
                                            variant="body_short"
                                            link
                                        >
                                            {commPkg.commPkgNo}
                                        </Typography>
                                    </Cell>
                                    <Cell
                                        as="td"
                                        style={{ verticalAlign: 'middle' }}
                                    >
                                        <Typography variant="body_short">
                                            {commPkg.description}
                                        </Typography>
                                    </Cell>
                                    <Cell
                                        as="td"
                                        style={{ verticalAlign: 'middle' }}
                                    >
                                        <Typography variant="body_short">
                                            {commPkg.status}
                                        </Typography>
                                    </Cell>
                                </Row>
                            )
                        )
                    ) : (
                        <Row>
                            <Cell
                                colSpan={3}
                                style={{
                                    verticalAlign: 'middle',
                                    width: '100%',
                                }}
                            >
                                <Typography
                                    style={{ textAlign: 'center' }}
                                    variant="body_short"
                                >
                                    Nothing to display
                                </Typography>
                            </Cell>
                        </Row>
                    )}
                </Body>
            </CustomTable>
        </Container>
    );
};

export default CommPkgsTable;
