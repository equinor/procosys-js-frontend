import { Container, CustomLink } from './index.style';
import { Query, QueryResult } from 'material-table';
import React, { useEffect, useRef } from 'react';

import { IPO } from '../types';
import { IpoStatusEnum } from '../../enums';
import Table from '@procosys/components/Table';
import { Tooltip } from '@material-ui/core';
import { Typography } from '@equinor/eds-core-react';
import { getFormattedDate } from '@procosys/core/services/DateService';
import { tokens } from '@equinor/eds-tokens';

interface InvitationsTableProps {
    getIPOs: (page: number, pageSize: number, orderByField: string | null, orderDirection: string | null) => Promise<any>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    shouldSelectFirstPage: boolean;
    setFirstPageSelected: () => void;
    projectName?: string;
    height: number;
    update: number;
    filterUpdate: number;
}


const InvitationsTable = ({getIPOs, pageSize, setPageSize, shouldSelectFirstPage, setFirstPageSelected, projectName, height, update, filterUpdate }: InvitationsTableProps): JSX.Element => {
    const refObject = useRef<any>();

    useEffect(() => {
        if (refObject.current) {
            refObject.current.onSearchChangeDebounce();
        }
    }, [projectName, filterUpdate]);

    useEffect(() => {
        if (refObject.current) {
            refObject.current.props.options.maxBodyHeight = height;
        }     
    }, [update, height]);

    const getIdColumn = (data: string):JSX.Element => {
        return (
            <CustomLink to={`/${data}`}>
                {data}
            </CustomLink>

        );
    };

    const getPkgColumn = (pkgs: string[] | undefined): JSX.Element => {
        const pkgsString = pkgs?.join(', ');

        return (
            <Tooltip title={<div>{pkgsString}</div>} arrow={true} enterDelay={200} enterNextDelay={100}>
                <Typography className='controlOverflow'>{pkgsString}</Typography>
            </Tooltip>
        );
    };

    const getTooltipColumn = (data: string): JSX.Element => {
        return (
            <Tooltip title={data} arrow={true} enterDelay={200} enterNextDelay={100}>
                <Typography className='controlOverflow'>{data}</Typography>
            </Tooltip>
        );
    };

    const getColumn = (data: string): JSX.Element => {
        return <Typography>{data}</Typography>;
    };


    const getIPOsByQuery = (query: Query<any>): Promise<QueryResult<any>> => {
        const sortFieldMap: { [key: string]: string } = {
            'ID': 'ipoNo',
            'Title': 'title',
            'Status': 'status',
            'Type': 'type',
            'Sent': 'createdAtUtc',
            'Punch-out': 'punchOutDateUtc',
            'Completed': 'completedAtUtc',
            'Accepted': 'acceptedAtUtc',
            'Contractor rep': 'contractorRep',
            'Construction rep': 'constructionCompanyRep',
        };

        if (shouldSelectFirstPage) {
            // set query to first page = 0
            query.page = 0;
            setFirstPageSelected();
        }

        const orderByField: string | null = query.orderBy ? sortFieldMap[query.orderBy.title as string] : null;
        const orderDirection: string | null = orderByField ? query.orderDirection ? query.orderDirection : 'asc' : null;

        return new Promise((resolve) => {
            return getIPOs(query.page, query.pageSize, orderByField, orderDirection).then(result => {
                if (refObject.current) {
                    refObject.current.props.options.maxBodyHeight = height;
                }
                resolve({
                    data: result.invitations,
                    page: query.page,
                    totalCount: result.maxAvailable
                });

            });
        });
    };

    return (
        <Container>
            <Table
                tableRef={refObject} //reference will be used by parent, to trigger rendering
                columns={[
                    { title: 'ID', render: (rowData: IPO): JSX.Element => getIdColumn(rowData.id.toString()) },
                    { title: 'Title', render: (rowData: IPO): JSX.Element => getTooltipColumn(rowData.title), cellStyle: { minWidth: '220px', maxWidth: '220px'}},
                    { title: 'Status', render: (rowData: IPO): JSX.Element => getColumn(rowData.status) },
                    { title: 'Type', render: (rowData: IPO): JSX.Element => getColumn(rowData.type) },
                    { title: 'Comm pkg', render: (rowData: IPO): JSX.Element => getPkgColumn(rowData.commPkgNos), cellStyle: { minWidth: '220px', maxWidth: '220px' }, sorting: false }, 
                    { title: 'MC pkg', render: (rowData: IPO): JSX.Element => getPkgColumn(rowData.mcPkgNos), cellStyle: { minWidth: '220px', maxWidth: '220px' }, sorting: false },
                    { title: 'Sent', render: (rowData: IPO): JSX.Element => getColumn(getFormattedDate(rowData.createdAtUtc)), defaultSort: 'desc' },
                    { title: 'Punch-out', render: (rowData: IPO): JSX.Element => getColumn(getFormattedDate(rowData.startTimeUtc)) },
                    { title: 'Completed', render: (rowData: IPO): JSX.Element => getColumn(rowData.completedAtUtc ? getFormattedDate(rowData.completedAtUtc) : '') },
                    { title: 'Accepted', render: (rowData: IPO): JSX.Element => getColumn(rowData.acceptedAtUtc ? getFormattedDate(rowData.acceptedAtUtc): '') },
                    { title: 'Contractor rep', render: (rowData: IPO): JSX.Element => getTooltipColumn(rowData.contractorRep), cellStyle: { minWidth: '220px', maxWidth: '220px'} },
                    { title: 'Construction rep', render: (rowData: IPO): JSX.Element => getTooltipColumn(rowData.constructionCompanyRep), cellStyle: { minWidth: '220px', maxWidth: '220px'} },
                ]}
                data={getIPOsByQuery}
                options={{
                    showTitle: false,
                    toolbar: false,
                    draggable: false,
                    selection: false,
                    search: false,
                    debounceInterval: 200,
                    selectionProps: { disableRipple: true },
                    padding: 'dense',
                    pageSize: pageSize,
                    emptyRowsWhenPaging: false,
                    pageSizeOptions: [10, 25, 50, 100],
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                        whiteSpace: 'nowrap',
                        fontFamily: 'Equinor',
                    },
                    rowStyle: (rowData): any => ({
                        opacity: rowData.status === IpoStatusEnum.CANCELED && 0.5,
                    }),
                    thirdSortClick: false
                }}
                style={{ boxShadow: 'none' }}
                onChangeRowsPerPage={setPageSize}
            />
        </Container>
    );
};

export default InvitationsTable;

