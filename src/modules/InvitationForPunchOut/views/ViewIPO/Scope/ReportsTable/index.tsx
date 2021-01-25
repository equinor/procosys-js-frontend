import { CommPkgScope, McPkgScope } from '../../types';
import { Container, CustomTable } from './style';
import { Table, Typography } from '@equinor/eds-core-react';

import React from 'react';
import { ReportIdEnum } from '../../enums';
import { useCurrentPlant } from '@procosys/core/PlantContext';

const getReportParams = (mcPkgNumbers: string[], commPkgNumbers: string[]): string => {
    let reportParams = '';

    if (mcPkgNumbers && mcPkgNumbers.length > 0) {
        reportParams += '&mcPkgs=';
        mcPkgNumbers.forEach(mcPkgNo => {
            reportParams += `${mcPkgNo},`;
        });
        reportParams = reportParams.slice(0, -1);
    }
    if (commPkgNumbers && commPkgNumbers.length > 0) {
        reportParams += '&commPkgs=';
        commPkgNumbers.forEach(commPkgNo => {
            reportParams += `${commPkgNo},`;
        });
        reportParams = reportParams.slice(0, -1);
    }
    return reportParams;
};


const { Head, Body, Cell, Row } = Table;

interface ReportsTableProps {
    mcPkgNumbers: string[];
    commPkgNumbers: string[];
}

const ReportsTable = ({ mcPkgNumbers, commPkgNumbers }: ReportsTableProps): JSX.Element => {
    const { plant } = useCurrentPlant();
    const reportParams = getReportParams(mcPkgNumbers, commPkgNumbers);

    const getReportUrl = (reportId: number): string => {
        if (reportId === ReportIdEnum.MC32D) {
            return `/${plant.pathId}/Report/AutoGenerate?reportId=${reportId}${reportParams}`;
        } else {
            return `/${plant.pathId}/Search/AutoGenerate?searchId=${reportId}${reportParams}`;
        }
    };

    return (
        <Container>
            <CustomTable>
                <Head>
                    <Row>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>Report</Cell>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>{' '}</Cell>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>{' '}</Cell>
                    </Row>
                </Head>
                <Body>
                    <Row as="tr">
                        <Cell as="td" style={{ verticalAlign: 'middle', lineHeight: '1em' }}>
                            <Typography href={getReportUrl(ReportIdEnum.MC32D)} variant="body_short" link>MC32D</Typography>
                        </Cell>
                        <Cell as="td" style={{ verticalAlign: 'middle' }}>MC Scope</Cell>
                        <Cell as="td" style={{ verticalAlign: 'middle', lineHeight: '1em' }}>
                            {' '}
                        </Cell>
                    </Row>
                    <Row as="tr">
                        <Cell as="td" style={{ verticalAlign: 'middle', lineHeight: '1em' }}>
                            <Typography href={getReportUrl(ReportIdEnum.MC84)} variant="body_short" link>MC84</Typography>
                        </Cell>
                        <Cell as="td" style={{ verticalAlign: 'middle' }}>Punch List</Cell>
                        <Cell as="td" style={{ verticalAlign: 'middle', lineHeight: '1em' }}>
                            {' '}
                        </Cell>
                    </Row>
                    <Row as="tr">
                        <Cell as="td" style={{ verticalAlign: 'middle', lineHeight: '1em' }}>
                            <Typography href={getReportUrl(ReportIdEnum.CDP06)} variant="body_short" link>CDP06</Typography>
                        </Cell>
                        <Cell as="td" style={{ verticalAlign: 'middle' }}>Concession Deviation Permit</Cell>
                        <Cell as="td" style={{ verticalAlign: 'middle', lineHeight: '1em' }}>
                            {' '}
                        </Cell>
                    </Row>
                </Body>
            </CustomTable>
        </Container>
    );
};

export default ReportsTable;

