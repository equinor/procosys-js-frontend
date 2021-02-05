import { Query, QueryResult } from 'material-table';
import React, { useEffect, useRef, useState } from 'react';

import { Container } from './index.style';
import { IPO } from '../types';
import { IpoStatusEnum } from '../../enums';
import Table from '@procosys/components/Table';
import { Typography } from '@equinor/eds-core-react';
import { getLocalDate } from '@procosys/core/services/DateService';
import { tokens } from '@equinor/eds-tokens';
import { useCurrentPlant } from '@procosys/core/PlantContext';

interface InvitationsTableProps {
    getIPOs: (page: number, pageSize: number, orderByField: string | null, orderDirection: string | null) => Promise<any>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    shouldSelectFirstPage: boolean;
    setFirstPageSelected: () => void;
    setOrderByField: (orderByField: string | null) => void;
    setOrderDirection: (orderDirection: string | null) => void;
    projectName?: string;
    height: number;
}


const InvitationsTable = ({getIPOs, pageSize, setPageSize, shouldSelectFirstPage, setFirstPageSelected, setOrderByField, setOrderDirection, projectName, height }: InvitationsTableProps): JSX.Element => {
    const refObject = useRef<any>();
    const [maxAvailable, setMaxAvailable] = useState<number>(0);
    const { plant } = useCurrentPlant();

    const getMcPkgUrl = (mcPkgNo: string): string => {
        return `/${plant.pathId}/Completion#McPkg|?projectName=${projectName}&mcpkgno=${mcPkgNo}`;
    };

    const getCommPkgUrl = (commPkgNo: string): string => {
        return `/${plant.pathId}/Completion#CommPkg|?projectName=${projectName}&commpkgno=${commPkgNo}`;
    };

    useEffect(() => {
        if (refObject.current) {
            refObject.current.onSearchChangeDebounce();
        }
    }, [projectName]);

    useEffect(() => {
        if (refObject.current) {
            refObject.current.props.options.maxBodyHeight = height;
        }     
    }, [height, maxAvailable]);

    const getIdColumn = (data: string):JSX.Element => {
        return (
            <div className='controlOverflow'><Typography link href={`/${plant.pathId}/InvitationForPunchOut/${data}`}>{data}</Typography></div>
        );

    };

    const getMcPkgColumn = (mcPkgs: string[] | undefined): JSX.Element => {
        return (
            <div>{mcPkgs?.map((pkgNo, index) => {
                const separator: any = index < mcPkgs.length-1 ? 
                    index % 2 ? <><span>{', '}</span><br /></> : <span>{', '}</span> : '';
                return (
                    <span key={pkgNo + index}><Typography link href={getMcPkgUrl(pkgNo)} key={pkgNo}>{pkgNo}</Typography>{separator}</span>
                );  
            })}
            </div>
        );
    };

    const getCommPkgColumn = (commPkgs: string[] | undefined): JSX.Element => {
        return (
            <div>{commPkgs?.map((pkgNo, index) => {
                const separator: any = index < commPkgs.length-1 ? 
                    index % 2 ? <><span>{', '}</span><br /></> : <span>{', '}</span> : '';
                return (
                    <span key={pkgNo + index}><Typography link href={getCommPkgUrl(pkgNo)} key={pkgNo}>{pkgNo}</Typography>{separator}</span>
                );  
            })}</div>
        );
    };

    const getColumn = (data: string): JSX.Element => {
        return (
            <div className='controlOverflow'><Typography>{data}</Typography></div>
        );
    };


    const getIPOsByQuery = (query: Query<any>): Promise<QueryResult<any>> => {
        const sortFieldMap: { [key: string]: string } = {
            'ID': 'id',
            'Title': 'title',
            'Status': 'status',
            'Type': 'type',
            'Sent': 'sent',
            'Punch-out': 'punchOut',
            'Completed': 'completed',
            'Accepted': 'accepted',
        };

        if (shouldSelectFirstPage) {
            // set query to first page = 0
            query.page = 0;
            setFirstPageSelected();
        }

        const orderByField: string | null = query.orderBy ? sortFieldMap[query.orderBy.title as string] : null;
        const orderDirection: string | null = orderByField ? query.orderDirection ? query.orderDirection : 'Asc' : null;
        setOrderByField(orderByField);
        setOrderDirection(orderDirection);

        return new Promise((resolve) => {
            return getIPOs(query.page, query.pageSize, orderByField, orderDirection).then(result => {
                setMaxAvailable(result.maxAvailable);
                resolve({
                    data: result.ipos,
                    page: query.page,
                    totalCount: result.maxAvailable
                });

            });
            // }
        });
    };

    return (
        <Container>
            <Table
                tableRef={refObject} //reference will be used by parent, to trigger rendering
                columns={[
                    { title: 'ID', render: (rowData: IPO): JSX.Element => getIdColumn(rowData.id.toString()) },
                    { title: 'Title', render: (rowData: IPO): JSX.Element => getColumn(rowData.title) },
                    { title: 'Status', render: (rowData: IPO): JSX.Element => getColumn(rowData.status) },
                    { title: 'Type', render: (rowData: IPO): JSX.Element => getColumn(rowData.type) },
                    { title: 'Comm pkg', render: (rowData: IPO): JSX.Element => getCommPkgColumn(rowData.commPkgNos), cellStyle: { minWidth: '220px', maxWidth: '220px' }, sorting: false }, 
                    { title: 'MC pkg', render: (rowData: IPO): JSX.Element => getMcPkgColumn(rowData.mcPkgNos), cellStyle: { minWidth: '220px', maxWidth: '220px' }, sorting: false },
                    { title: 'Sent', render: (rowData: IPO): JSX.Element => getColumn(getLocalDate(rowData.createdAtUtc)), defaultSort: 'desc' },
                    { title: 'Punch-out', render: (rowData: IPO): JSX.Element => getColumn(getLocalDate(rowData.startTimeUtc)) },
                    { title: 'Completed', render: (rowData: IPO): JSX.Element => getColumn(getLocalDate(rowData.completedAtUtc)) },
                    { title: 'Accepted', render: (rowData: IPO): JSX.Element => getColumn(getLocalDate(rowData.acceptedAtUtc)) },
                    { title: 'Contractor rep', render: (rowData: IPO): JSX.Element => getColumn(rowData.contractorRep) },
                    { title: 'Construction rep', render: (rowData: IPO): JSX.Element => getColumn(rowData.constructionCompanyRep) },
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
                    pageSizeOptions: [10, 50, 100, 500, 1000],
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                        whiteSpace: 'nowrap',
                        fontFamily: 'Equinor',
                    },
                    rowStyle: (rowData): any => ({
                        opacity: rowData.status === IpoStatusEnum.CANCELED && 0.5,
                        color: rowData.status === IpoStatusEnum.CANCELED && tokens.colors.interactive.danger__text.rgba,
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

