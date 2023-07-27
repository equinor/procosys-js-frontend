import { Container, CustomLink } from './index.style';
import React, { useEffect, useState } from 'react';
import { IPO } from '../types';
import { Typography } from '@equinor/eds-core-react';
import { getFormattedDate } from '@procosys/core/services/DateService';
import { Query, TableOptions, UseTableRowProps } from 'react-table';
import ProcosysTable, { TableSorting } from '@procosys/components/Table';
import { Tooltip } from '@mui/material';
import { IpoStatusEnum } from '../../enums';

interface InvitationsTableProps {
    getIPOs: (
        page: number,
        pageSize: number,
        orderByField: string | null,
        orderDirection: string | null
    ) => Promise<any>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    shouldSelectFirstPage: boolean;
    setFirstPageSelected: () => void;
    projectName?: string;
    height: number;
    update: number;
    filterUpdate: number;
    loading: boolean;
    setOrderByField: (orderByField: string | null) => void;
    setOrderDirection: (direction: string | null) => void;
}

interface IPOQuery {
    page: number;
    pageSize: number;
    orderBy: { title: string; orderDirection: string };
}

const InvitationsTable = ({
    getIPOs,
    pageSize,
    setPageSize,
    shouldSelectFirstPage,
    setFirstPageSelected,
    projectName,
    height,
    update,
    filterUpdate,
    loading,
    setOrderByField,
    setOrderDirection,
}: InvitationsTableProps): JSX.Element => {
    const [sortBy, setSortBy] = useState<{
        id: string | undefined;
        desc: boolean;
    }>({ id: 'createdAtUtc', desc: true });
    const [pageIndex, setPageIndex] = useState(0);
    const [maxRows, setMaxRows] = useState<number>(0);
    const [data, setData] = useState<IPO[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);

    useEffect(() => {
        const req = {
            page: 0,
            pageSize: pageSize,
            orderBy: { title: 'createdAtUtc' },
            orderDirection: 'desc',
        } as Query<IPOQuery>;
        getIPOsByQuery(req);
    }, [projectName, filterUpdate]);

    useEffect(() => {
        const req = {
            page: pageIndex,
            pageSize: pageSize,
            orderBy: { title: sortBy.id },
            orderDirection: sortBy.desc ? 'desc' : 'asc',
        } as Query<IPOQuery>;
        getIPOsByQuery(req);
    }, [pageSize, pageIndex]);

    useEffect(() => {
        const req = {
            page: pageIndex,
            pageSize: pageSize,
            orderBy: { title: sortBy.id || 'createdAtUtc' },
            orderDirection: sortBy.desc ? 'desc' : 'asc',
        } as Query<IPOQuery>;
        getIPOsByQuery(req);
    }, [sortBy]);

    const getIPOsByQuery = (query: Query<IPOQuery>): void => {
        getIPOs(
            query.page,
            query.pageSize,
            query.orderBy.title as string,
            query.orderDirection
        ).then((result) => {
            setData(result.invitations);
            setOrderByField(query.orderBy.title);
            setOrderDirection(query.orderDirection);
            setMaxRows(result.maxAvailable);
            setPageCount(Math.ceil(result.maxAvailable / pageSize));
        });
    };

    const getIdColumn = (row: TableOptions<IPO>): JSX.Element => {
        const data = (row.value as IPO).id.toString();
        return <CustomLink to={`/${data}`}>{data}</CustomLink>;
    };

    const getProjectNameColumn = (row: TableOptions<IPO>): JSX.Element => {
        const data = (row.value as IPO).projectName;
        return (
            <div className="controlOverflow">
                <Tooltip
                    title={data || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{data}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getTitleColum = (row: TableOptions<IPO>): JSX.Element => {
        const data = (row.value as IPO).title;
        return (
            <div className="controlOverflow">
                <Tooltip
                    title={data || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{data}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getPkgColumn = (row: TableOptions<IPO>): JSX.Element => {
        const pkgs = (row.value as IPO).commPkgNos;
        const pkgsString = pkgs?.join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={pkgsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{pkgsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getMCPkgColumn = (row: TableOptions<IPO>): JSX.Element => {
        const pkgs = (row.value as IPO).mcPkgNos;
        const pkgsString = pkgs?.join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={pkgsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{pkgsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getContractorRepsColumn = (row: TableOptions<IPO>): JSX.Element => {
        const contractorRep = (row.value as IPO).contractorRep;
        const additionalContractorReps = (row.value as IPO)
            .additionalContractorReps;
        const contractorRepsString = [
            contractorRep,
            ...additionalContractorReps,
        ].join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={contractorRepsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{contractorRepsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getConstructionRepsColumn = (row: TableOptions<IPO>): JSX.Element => {
        const constructionRep = (row.value as IPO).constructionCompanyRep;
        const additionalConstructionCompanyReps = (row.value as IPO)
            .additionalConstructionCompanyReps;
        const constructionCompRepsString = [
            constructionRep,
            ...additionalConstructionCompanyReps,
        ].join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={constructionCompRepsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{constructionCompRepsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getCommissioningRepColumn = (row: TableOptions<IPO>): JSX.Element => {
        const commReps = (row.value as IPO).commissioningReps;
        const commRepsString = commReps?.join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={commRepsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{commRepsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getOperationRepColumn = (row: TableOptions<IPO>): JSX.Element => {
        const opReps = (row.value as IPO).operationReps;
        const opRepsString = opReps?.join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={opRepsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{opRepsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getTechnicalIntegrityRepColumn = (
        row: TableOptions<IPO>
    ): JSX.Element => {
        const techintReps = (row.value as IPO).technicalIntegrityReps;
        const techintRepsString = techintReps?.join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={techintRepsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{techintRepsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getSupplierRepColumn = (row: TableOptions<IPO>): JSX.Element => {
        const supplierReps = (row.value as IPO).supplierReps;
        const supplierRepsString = supplierReps?.join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={supplierRepsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{supplierRepsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const getExternalGuestColumn = (row: TableOptions<IPO>): JSX.Element => {
        const externalGuests = (row.value as IPO).externalGuests;
        const externalGuestsString = externalGuests?.join(', ');

        return (
            <div className="controlOverflow">
                <Tooltip
                    title={externalGuestsString || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <Typography>{externalGuestsString}</Typography>
                </Tooltip>
            </div>
        );
    };

    const tableColumns = [
        {
            Header: 'ID',
            id: 'ipoNo',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getIdColumn,
        },
        {
            Header: 'Project',
            id: 'projectName',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getProjectNameColumn,
        },
        {
            Header: 'Title',
            id: 'title',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getTitleColum,
            width: 220,
        },
        {
            Header: 'Status',
            id: 'status',
            accessor: (d: IPO): string | undefined => {
                if (d.status == IpoStatusEnum.SCOPEHANDEDOVER)
                    return 'Scope handed over';
                else return d.status;
            },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => {
                return <Typography>{rowData.row.values.status}</Typography>;
            },
        },
        {
            Header: 'Type',
            id: 'type',
            accessor: (d: IPO): string | undefined => {
                return d.type;
            },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => {
                return <Typography>{rowData.row.values.type}</Typography>;
            },
        },
        {
            Header: 'Comm pkg',
            defaultCanSort: false,
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getPkgColumn,
            width: 220,
        },
        {
            Header: 'MC pkg',
            defaultCanSort: false,
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getMCPkgColumn,
            width: 220,
        },
        {
            Header: 'Sent',
            id: 'createdAtUtc',
            accessor: (d: IPO): Date => {
                return d.createdAtUtc;
            },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => {
                return (
                    <Typography>
                        {getFormattedDate(rowData.row.values.createdAtUtc)}
                    </Typography>
                );
            },
        },
        {
            Header: 'Punch-out',
            id: 'punchOutDateUtc',
            accessor: (d: IPO): Date => {
                return d.startTimeUtc;
            },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => {
                return (
                    <Typography>
                        {getFormattedDate(rowData.row.values.punchOutDateUtc)}
                    </Typography>
                );
            },
        },
        {
            Header: 'Completed',
            id: 'completedAtUtc',
            accessor: (d: IPO): Date | undefined => {
                return d.completedAtUtc;
            },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => {
                return (
                    <Typography>
                        {rowData.row.values.completedAtUtc
                            ? getFormattedDate(
                                  rowData.row.values.completedAtUtc
                              )
                            : ''}
                    </Typography>
                );
            },
        },
        {
            Header: 'Accepted',
            id: 'acceptedAtUtc',
            accessor: (d: IPO): Date | undefined => {
                return d.acceptedAtUtc;
            },
            Cell: (rowData: TableOptions<IPO>): JSX.Element => {
                return (
                    <Typography>
                        {rowData.row.values.acceptedAtUtc
                            ? getFormattedDate(rowData.row.values.acceptedAtUtc)
                            : ''}
                    </Typography>
                );
            },
        },
        {
            Header: 'Contractor rep',
            id: 'contractorRep',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getContractorRepsColumn,
            width: 220,
        },
        {
            Header: 'Construction company rep',
            id: 'constructionCompanyRep',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getConstructionRepsColumn,
            width: 220,
        },
        {
            Header: 'Commissioning rep',
            id: 'commissioningReps',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getCommissioningRepColumn,
            width: 220,
        },
        {
            Header: 'Operation rep',
            id: 'operationReps',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getOperationRepColumn,
            width: 220,
        },
        {
            Header: 'Technical integrity rep',
            id: 'technicalIntegrityReps',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getTechnicalIntegrityRepColumn,
            width: 220,
        },
        {
            Header: 'Supplier rep',
            id: 'supplierReps',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getSupplierRepColumn,
            width: 220,
        },
        {
            Header: 'External rep',
            id: 'externalGuests',
            accessor: (d: UseTableRowProps<IPO>): UseTableRowProps<IPO> => d,
            Cell: getExternalGuestColumn,
            width: 220,
        },
    ];

    const setSorting = (input: TableSorting): void => {
        if (input) {
            if (sortBy.id !== input.id || sortBy.desc !== input.desc) {
                setSortBy(input);
            }
        } else if (sortBy.id) {
            setSortBy({ id: undefined, desc: true });
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
                pageCount={pageCount}
            />
        </Container>
    );
};

export default InvitationsTable;
