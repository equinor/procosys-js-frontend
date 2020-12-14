import { CommPkgScope, McPkgScope } from '../../types';
import { Container, CustomTable } from './style';
import { Table, Typography } from '@equinor/eds-core-react';

import React from 'react';
import { ReportIdEnum } from '../../enums';
import { useCurrentPlant } from '@procosys/core/PlantContext';

const getReportParams = (mcScope: McPkgScope[], commScope: CommPkgScope[]): string => {
    let reportParams = '';

    if (mcScope && mcScope.length > 0) {
        reportParams += '&mcPkgs=';
        mcScope.forEach(mcPkg => {
            reportParams += `${mcPkg.mcPkgNo},`;
        });
        reportParams = reportParams.slice(0, -1);
    }
    if (commScope && commScope.length > 0) {
        reportParams += '&commPkgs=';
        commScope.forEach(commPkg => {
            reportParams += `${commPkg.commPkgNo},`;
        });
        reportParams = reportParams.slice(0, -1);
    }
    return reportParams;
};


const { Head, Body, Cell, Row } = Table;

interface ReportsTableProps {
    mcPkgScope: McPkgScope[];
    commPkgScope: CommPkgScope[];
}

const ReportsTable = ({ mcPkgScope, commPkgScope }: ReportsTableProps ): JSX.Element => {
    const { plant } = useCurrentPlant();
    const reportParams = getReportParams(mcPkgScope, commPkgScope);

    const goToReport = (reportId: number): void => {
        if (reportId === ReportIdEnum.MC32) {
            window.location.href = `/${plant.pathId}/Report/AutoGenerate?reportId=${reportId}${reportParams}`;
        } else {
            window.location.href = `/${plant.pathId}/Search/AutoGenerate?searchId=${reportId}${reportParams}`;
        }
    };
 
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
                    <Row as="tr">
                        <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                            <Typography onClick={(): void => goToReport(ReportIdEnum.MC32)} variant="body_short" link>MC32</Typography>
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle'}}>MC Scope</Cell>
                        <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                            {' '}
                        </Cell>
                    </Row>
                    <Row as="tr">
                        <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                            <Typography onClick={(): void => goToReport(ReportIdEnum.MC84)} variant="body_short" link>MC84</Typography>
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle'}}>Punch List</Cell>
                        <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                            {' '}
                        </Cell>
                    </Row>
                    <Row as="tr">
                        <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                            <Typography onClick={(): void => goToReport(ReportIdEnum.CDP06)} variant="body_short" link>CDP06</Typography>
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle'}}>Concession Deviation Permit</Cell>
                        <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                            {' '}
                        </Cell>
                    </Row>
                </Body>
            </CustomTable> 
        </Container>
    );
};

export default ReportsTable;

