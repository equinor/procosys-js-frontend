import { Container, CustomLink } from './index.style';
import React, { useEffect, useState } from 'react';
import { IPO } from '../types';
import { Tooltip } from '@material-ui/core';
import { Typography } from '@equinor/eds-core-react';
import { getFormattedDate } from '@procosys/core/services/DateService';
import { Query, TableOptions, UseTableRowProps } from 'react-table';
import ProcosysTable, { TableSorting } from '@procosys/components/Table';

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
    loading: boolean;
}

interface IPOQuery {
    page: number;
    pageSize: number;
    orderBy: { title: string, orderDirection: string };
}


const InvitationsTable = ({ getIPOs, pageSize, setPageSize, shouldSelectFirstPage, setFirstPageSelected, projectName, height, update, filterUpdate, loading }: InvitationsTableProps): JSX.Element => {
    const [sortBy, setSortBy] = useState<{ id: string | undefined, desc: boolean }>({ id: 'createdAtUtc', desc: true });
    const [pageIndex, setPageIndex] = useState(0);
    const [maxRows, setMaxRows] = useState<number>(0);
    const [data, setData] = useState<IPO[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);

    useEffect(() => {
        const req = { page: 0, pageSize: pageSize, orderBy: { title: 'createdAtUtc' }, orderDirection: 'desc' } as Query<IPOQuery>;
        getIPOsByQuery(req);
    }, [projectName, filterUpdate]);


    useEffect(() => {
        const req = { page: pageIndex, pageSize: pageSize, orderBy: { title: sortBy.id }, orderDirection: sortBy.desc ? 'desc' : 'asc' } as Query<IPOQuery>;
        getIPOsByQuery(req);

    }, [pageSize, pageIndex]);

    useEffect(() => {
        const req = { page: pageIndex, pageSize: pageSize, orderBy: { title: sortBy.id || 'createdAtUtc' }, orderDirection: sortBy.desc ? 'desc' : 'asc' } as Query<IPOQuery>;
        getIPOsByQuery(req);
    }, [sortBy]);


    const getIPOsByQuery = (query: Query<IPOQuery>): void => {
        getIPOs(query.page, query.pageSize, query.orderBy.title as string, query.orderDirection).then(result => {
            setData(result.invitations);
            setMaxRows(result.maxAvailable);
            setPageCount(Math.ceil(result.maxAvailable / pageSize));
        });
    };

    const getIdColumn = (row: TableOptions<IPO>): JSX.Element => {
        const data = (row.value as IPO).id.toString();
        return (
            <CustomLink to={`/${data}`}>
                {data}
            </CustomLink>

        );
    };

    const getTitleColum = (row: TableOptions<IPO>): JSX.Element => {
        const data = (row.value as IPO).title;
        return (
            <div className='controlOverflow'>
                <Tooltip title={data || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <Typography>{data}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getPkgColumn = (row: TableOptions<IPO>): JSX.Element => {
        const pkgs = (row.value as IPO).commPkgNos;
        const pkgsString = pkgs?.join(', ');

        return (
            <div className='controlOverflow'>
                <Tooltip title={pkgsString || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <Typography>{pkgsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getMCPkgColumn = (row: TableOptions<IPO>): JSX.Element => {
        const pkgs = (row.value as IPO).mcPkgNos;
        const pkgsString = pkgs?.join(', ');

        return (
            <div className='controlOverflow'>
                <Tooltip title={pkgsString || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <Typography>{pkgsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getContractorRepColumn = (row: TableOptions<IPO>): JSX.Element => {
        const data = (row.value as IPO).contractorRep;
        return (
            <div className='controlOverflow'>
                <Tooltip title={data || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <Typography>{data}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getConstructionRepColumn = (row: TableOptions<IPO>): JSX.Element => {
        const data = (row.value as IPO).constructionCompanyRep;
        return (
            <div className='controlOverflow'>
                <Tooltip title={data || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <Typography>{data}</Typography>
                </Tooltip>
            </div>
        );
    };

    const tableColumns = [
        {
            Header: 'ID',
            id: 'ipoNo',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getIdColumn
        },
        {
            Header: 'Title',
            id: 'title',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getTitleColum,
            width: 220
        },
        {
            Header: 'Status',
            id: 'status',
            accessor: (d: IPO): string | undefined => { return d.status; },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => { return <Typography>{rowData.row.values.status}</Typography>; },
        },
        {
            Header: 'Type',
            id: 'type',
            accessor: (d: IPO): string | undefined => { return d.type; },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => { return <Typography>{rowData.row.values.type}</Typography>; },
        },
        {
            Header: 'Comm pkg',
            defaultCanSort: false,
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getPkgColumn,
            width: 220
        },
        {
            Header: 'MC pkg',
            defaultCanSort: false,
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getMCPkgColumn,
            width: 220
        },
        {
            Header: 'Sent',
            id: 'createdAtUtc',
            accessor: (d: IPO): Date => { return d.createdAtUtc; },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => { return <Typography>{getFormattedDate(rowData.row.values.createdAtUtc)}</Typography>; },
        },
        {
            Header: 'Punch-out',
            id: 'punchOutDateUtc',
            accessor: (d: IPO): Date => { return d.startTimeUtc; },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => { return <Typography>{getFormattedDate(rowData.row.values.punchOutDateUtc)}</Typography>; },
        },
        {
            Header: 'Completed',
            id: 'completedAtUtc',
            accessor: (d: IPO): Date | undefined => { return d.completedAtUtc; },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => { return <Typography>{rowData.row.values.completedAtUtc ? getFormattedDate(rowData.row.values.completedAtUtc) : ''}</Typography>; },
        },
        {
            Header: 'Accepted',
            id: 'acceptedAtUtc',
            accessor: (d: IPO): Date | undefined => { return d.acceptedAtUtc; },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => { return <Typography>{rowData.row.values.acceptedAtUtc ? getFormattedDate(rowData.row.values.acceptedAtUtc) : ''}</Typography>; },
        },
        {
            Header: 'Contractor rep',
            id: 'contractorRep',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getContractorRepColumn,
            width: 220
        },
        {
            Header: 'Construction rep',
            id: 'constructionCompanyRep',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getConstructionRepColumn,
            width: 220
        },
    ];

    const setSorting = (input: TableSorting): void => {
        if (input) {
            if ((sortBy.id !== input.id || sortBy.desc !== input.desc)) {
                setSortBy(input);
            }
        }
    };

    return (
        <Container>
            <ProcosysTable
                setPageSize={setPageSize}
                onSort={setSorting}
                setPageIndex={setPageIndex}
                orderBy={sortBy}
                pageIndex={pageIndex}
                pageSize={pageSize}
                maxRowCount={maxRows}
                columns={tableColumns}
                data={data || []}
                loading={loading}
                rowSelect={false}
                pageCount={pageCount} />
        </Container>
    );
};

export default InvitationsTable;


