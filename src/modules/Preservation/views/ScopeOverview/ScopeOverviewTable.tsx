import { Container, SingleIconContainer, TagLink } from '@procosys/modules/Preservation/views/ScopeOverview/ScopeOverviewTable.style';
import { PreservedTag, PreservedTags } from '@procosys/modules/Preservation/views/ScopeOverview/types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ColumnInstance, TableOptions, UseTableRowProps } from 'react-table';
import { getFirstUpcomingRequirement, isTagOverdue } from './ScopeOverview';

import EdsIcon from '@procosys/components/EdsIcon';
import ProcosysTable from '@procosys/components/Table';
import RequirementIcons from '@procosys/modules/Preservation/views/ScopeOverview/RequirementIcons';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import { Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import { JSXBreakpoints } from '@procosys/core/styling';

interface ScopeOverviewTableProps {
    getData: (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null) => Promise<PreservedTags | undefined>;
    setRefreshScopeListCallback: (callback: (maxHeight: number, refreshOnResize?: boolean) => void) => void;
    pageSize: number;
    pageIndex: number;
    showTagDetails: (tag: PreservedTag) => void;
    setSelectedTags: (tags: PreservedTag[]) => void;
    selectedTags: PreservedTag[];
    setOrderByField: (orderByField: string | null) => void;
    setOrderDirection: (orderDirection: string | null) => void;
}

const StyledTooltip = styled(Tooltip)`
    font-size: 14px;
`;

const ScopeOverviewTable = (props: ScopeOverviewTableProps): JSX.Element => {

    enum ActionStatus {
        Closed = 'HasClosed',
        Open = 'HasOpen',
        OverDue = 'HasOverdue'
    }

    const getRequirementColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <div
                style={{ cursor: 'pointer', opacity: tag.isVoided ? '0.5' : '1' }}

                onClick={(): void => props.showTagDetails(tag)} >
                <RequirementIcons tag={tag} />
            </ div>
        );
    }, []);

    const getResponsibleColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <StyledTooltip title={tag.responsibleDescription || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>{tag.responsibleCode}</div>
            </StyledTooltip>
        );
    }, []);

    const getDueColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const requirement = getFirstUpcomingRequirement(row.value as PreservedTag);
        return (
            <div className='controlOverflow' style={{ color: requirement && isTagOverdue((row.value as PreservedTag)) ? tokens.colors.interactive.danger__text.rgba : '' }}>
                {(!requirement || (row.value as PreservedTag).isVoided) ? null : requirement.nextDueWeeks}
            </div>);
    }, []);

    const getNextColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const requirement = getFirstUpcomingRequirement(row.value as PreservedTag);
        return (
            <div className='controlOverflow' style={{ color: requirement && isTagOverdue((row.value as PreservedTag)) ? tokens.colors.interactive.danger__text.rgba : '' }}>
                {(!requirement || (row.value as PreservedTag).isVoided) ? null : requirement.nextDueAsYearAndWeek}
            </div>);
    }, []);

    const getActionsHeader = (): JSX.Element => {
        return (
            <SingleIconContainer>
                <EdsIcon name='notifications' size={24} color={tokens.colors.text.static_icons__tertiary.rgba} />
            </SingleIconContainer>
        );
    };

    const getActionsColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        if (!tag.actionStatus || tag.actionStatus === ActionStatus.Closed) {
            return <div></div>;
        }

        return (
            <Tooltip
                title={tag.actionStatus === ActionStatus.OverDue ? 'Overdue action(s)' : 'Open action(s)'}
                arrow={true}
                enterDelay={200}
                enterNextDelay={100}
            >
                <SingleIconContainer>
                    <div style={{ opacity: tag.isVoided ? '0.5' : '1' }}>
                        <EdsIcon
                            name='notifications'
                            size={24}
                            color={
                                tag.actionStatus === ActionStatus.OverDue
                                    ? tokens.colors.interactive.danger__text.rgba
                                    : tokens.colors.text.static_icons__tertiary.rgba
                            }
                        />
                    </div>
                </SingleIconContainer>
            </Tooltip>
        );
    }, []);

    const getTagNoColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <TagLink
                isOverdue={isTagOverdue(tag)}
                isVoided={tag.isVoided}
                onClick={(): void => props.showTagDetails(tag)}
            >
                <Tooltip title={tag.tagNo || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <span style={{ color: 'inherit', opacity: tag.isVoided ? '0.5' : '1' }}>{tag.tagNo}</span>
                </Tooltip>
            </TagLink>
        );
    }, []);

    const getDescriptionColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <Tooltip title={tag.description || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>
                    {tag.description}
                </div>
            </Tooltip>
        );
    }, []);

    const getPOColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (<Tooltip title={tag.calloffNo ? `${tag.purchaseOrderNo}/${tag.calloffNo}` : tag.purchaseOrderNo ? tag.purchaseOrderNo : ''} arrow={true} enterDelay={200} enterNextDelay={100}>
            <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>
                {tag.calloffNo ? `${tag.purchaseOrderNo}/${tag.calloffNo}` : tag.purchaseOrderNo}
            </div>
        </Tooltip>);
    }, []);

    const getAreaCode = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>
                {tag.areaCode}
            </div>);
    }, []);

    const getDisciplineCode = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>
                {tag.disciplineCode}
            </div>);
    }, []);

    const getMode = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>
                {tag.mode}
            </div>);
    }, []);

    const getStatus = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.row.original as PreservedTag;

        return (
            <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>
                {tag.status}
            </div>);
    }, []);

    const { mobileColumns, desktopColumns } = getColumns(getTagNoColumn, getDescriptionColumn, getDueColumn, getNextColumn, getMode, getPOColumn, getAreaCode, getResponsibleColumn, getDisciplineCode, getStatus, getRequirementColumn, getActionsHeader, getActionsColumn);

    const [maxRows, setMaxRows] = useState<number>(0);

    const [pageIndex, setPageIndex] = useState(props.pageIndex);
    const [pageSize, setPageSize] = useState(props.pageSize);
    const fetchIdRef = useRef(0);
    const tableRef = useRef();
    const [sortBy, setSortBy] = useState<{ id: string | undefined, desc: boolean }>({ id: 'due', desc: true });
    const [data, setData] = useState<PreservedTag[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [columns, _setColumns] = useState<ColumnInstance<any>[]>([]);
    const columnsRef = useRef<ColumnInstance<any>[]>(columns);

    const setColumns = (newValue: any[]): void => {
        columnsRef.current = newValue;
        _setColumns(newValue);
    };


    const getData = async ({ tablePageIndex, tablePageSize }: any, sortField = 'Due', sortDir = 'desc'): Promise<void> => {
        if (!tablePageSize && !tablePageIndex) {
            setLoading(false);
            return;
        }
        setLoading(true);

        const fetchId = ++fetchIdRef.current;

        if (sortBy.id) {
            sortField = (sortBy as any).id;
            sortDir = sortBy.desc ? 'desc' : 'asc';
            props.setOrderByField(sortField);
            props.setOrderDirection(sortDir);
        }

        if (fetchId === fetchIdRef.current) {
            await props.getData(tablePageIndex, tablePageSize, sortField, sortDir).then((res) => {
                if (res) {
                    setData(res.tags);
                    setMaxRows(res.maxAvailable);
                    setLoading(false);
                }
            });
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        const reRenderTable = (): void => {
            if (window.innerWidth <= JSXBreakpoints.MOBILE) {
                setColumns(mobileColumns);
            } else {
                setColumns(desktopColumns);
            }
        };

        window.addEventListener('resize', reRenderTable);

        return (): void => {
            window.removeEventListener('resize', reRenderTable);
        };
    }, []);

    useEffect(() => {
        setColumns(desktopColumns);
    }, []);

    useEffect(() => {

        props.setRefreshScopeListCallback((maxHeight?: number, refreshOnResize = false) => {
            const req = { tablePageIndex: 0, tablePageSize: pageSize };
            setPageIndex(0);
            getData(req);
        });
    });

    useEffect(() => {
        getData({ tablePageIndex: pageIndex, tablePageSize: pageSize }, sortBy.id, sortBy.desc ? 'desc' : 'asc');
    }, [pageSize, sortBy, pageIndex]);



    const setSorting = (input: { id: string, desc: boolean }): void => {
        if (input) {
            if ((sortBy.id !== input.id || sortBy.desc !== input.desc)) {
                setSortBy(input);
                props.setOrderByField(input.id);
            }
        } else if (sortBy.id) {
            setSortBy({ id: undefined, desc: true });
        }
    };

    return (
        <Container>
            <Typography variant='body_long'>{props.selectedTags.length} tags selected</Typography>
            <ProcosysTable
                loading={loading}
                setPageSize={setPageSize}
                onSort={setSorting}
                onSelectedChange={props.setSelectedTags}
                ref={tableRef}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                columns={columns}
                clientPagination={false}
                clientSorting={false}
                maxRowCount={maxRows}
                data={data || []}
                rowSelect={true}
                orderBy={sortBy}
                pageCount={0} />
        </Container>

    );

};

export default ScopeOverviewTable;

function getColumns(
    getTagNoColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getDescriptionColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getDueColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getNextColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getMode: (row: TableOptions<PreservedTag>) => JSX.Element,
    getPOColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getAreaCode: (row: TableOptions<PreservedTag>) => JSX.Element,
    getResponsibleColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getDisciplineCode: (row: TableOptions<PreservedTag>) => JSX.Element,
    getStatus: (row: TableOptions<PreservedTag>) => JSX.Element,
    getRequirementColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getActionsHeader: () => JSX.Element,
    getActionsColumn: (row: TableOptions<PreservedTag>) => JSX.Element): {
        mobileColumns: (
            {
                Header: string;
                accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>;
                id: string; Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
                width: number;
                maxWidth: number;
                minWidth: number;
                defaultCanSort?: undefined;
            } | {
                Header: string;
                accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>;
                id: string;
                Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
                defaultCanSort: boolean;
                width: number;
                maxWidth: number;
                minWidth: number;
            } | {
                Header: string;
                accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>; 
                Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                width: number; 
                maxWidth: number; 
                minWidth: number; 
                id?: undefined; 
                defaultCanSort?: undefined;
            } | { 
                Header: string; 
                id: string; 
                accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>; 
                Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                width?: undefined; 
                maxWidth?: undefined; 
                minWidth?: undefined; 
                defaultCanSort?: undefined; 
            } | { 
                Header: string; 
                accessor: (d: PreservedTag) => string | undefined; 
                id: string; 
                Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                width?: undefined; 
                maxWidth?: undefined; 
                minWidth?: undefined; 
                defaultCanSort?: undefined; 
            } | { 
                Header: JSX.Element; 
                accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>; 
                id: string; 
                Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                defaultCanSort: boolean; 
                width: number; 
                maxWidth: number; 
                minWidth: number; 
            })[]; 
            desktopColumns: (
                { 
                    Header: string; 
                    accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>; 
                    id: string; 
                    Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                    width: number; 
                    maxWidth: number; 
                    minWidth: number; 
                    defaultCanSort?: undefined; 
                } | { 
                    Header: string; 
                    accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>; 
                    Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                    width: number; 
                    maxWidth: number; 
                    minWidth: number; 
                    id?: undefined; 
                    defaultCanSort?: undefined; 
                } | { 
                    Header: string; 
                    id: string; 
                    accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>; 
                    Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                    width?: undefined; 
                    maxWidth?: undefined; 
                    minWidth?: undefined; 
                    defaultCanSort?: undefined; 
                } | { 
                    Header: string; 
                    accessor: (d: PreservedTag) => string | undefined; 
                    id: string; 
                    Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                    width?: undefined; 
                    maxWidth?: undefined; 
                    minWidth?: undefined; 
                    defaultCanSort?: undefined; 
                } | { 
                    Header: string; 
                    accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>; 
                    id: string; 
                    Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                    defaultCanSort: boolean; 
                    width: number; 
                    maxWidth: number; 
                    minWidth: number; 
                } | { 
                    Header: JSX.Element; 
                    accessor: (d: UseTableRowProps<PreservedTag>) => UseTableRowProps<PreservedTag>; id: string; 
                    Cell: (row: TableOptions<PreservedTag>) => JSX.Element; 
                    defaultCanSort: boolean; 
                    width: number; 
                    maxWidth: number; 
                    minWidth: number; 
                })[];
    } {
    const desktopColumns = [
        {
            Header: 'Tag no',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'tagNo',
            Cell: getTagNoColumn,
            width: 180,
            maxWidth: 400,
            minWidth: 150,
        },
        {
            Header: 'Description',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getDescriptionColumn,
            width: 250,
            maxWidth: 400,
            minWidth: 80,
        },
        {
            Header: 'Due',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'due',
            Cell: getDueColumn,
            width: 60,
            maxWidth: 100,
            minWidth: 50
        },
        {
            Header: 'Next',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'Due',
            Cell: getNextColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50
        },
        {
            Header: 'Mode',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getMode,
            width: 200,
            maxWidth: 400,
            minWidth: 50,
        },
        {
            Header: 'PO',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'PO',
            Cell: getPOColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Area',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'Area',
            Cell: getAreaCode,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Resp',
            id: 'responsible',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getResponsibleColumn,
        },
        {
            Header: 'Disc',
            id: 'discipline',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getDisciplineCode
        },
        {
            Header: 'Status',
            accessor: (d: PreservedTag): string | undefined => { return d.status; },
            id: 'status',
            Cell: getStatus
        },
        {
            Header: 'Req type',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'reqtype',
            Cell: getRequirementColumn,
            defaultCanSort: false,
            width: 200,
            maxWidth: 400,
            minWidth: 150
        },
        {
            Header: getActionsHeader(),
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'actions',
            Cell: getActionsColumn,
            defaultCanSort: false,
            width: 60,
            maxWidth: 100,
            minWidth: 30
        },
    ];

    const mobileColumns = [
        {
            Header: 'Tag no',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'tagNo',
            Cell: getTagNoColumn,
            width: 180,
            maxWidth: 400,
            minWidth: 150,
        },
        {
            Header: 'Req type',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'reqtype',
            Cell: getRequirementColumn,
            defaultCanSort: false,
            width: 200,
            maxWidth: 400,
            minWidth: 150
        },
        {
            Header: 'Due',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'due',
            Cell: getDueColumn,
            width: 60,
            maxWidth: 100,
            minWidth: 50
        },
        {
            Header: 'Next',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'Due',
            Cell: getNextColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50
        },
        {
            Header: 'Mode',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getMode,
            width: 200,
            maxWidth: 400,
            minWidth: 50,
        },
        {
            Header: 'PO',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'PO',
            Cell: getPOColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Area',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'Area',
            Cell: getAreaCode,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Resp',
            id: 'responsible',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getResponsibleColumn,
        },
        {
            Header: 'Disc',
            id: 'discipline',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getDisciplineCode
        },
        {
            Header: 'Status',
            accessor: (d: PreservedTag): string | undefined => { return d.status; },
            id: 'status',
            Cell: getStatus
        },
        {
            Header: getActionsHeader(),
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'actions',
            Cell: getActionsColumn,
            defaultCanSort: false,
            width: 60,
            maxWidth: 100,
            minWidth: 30
        },
    ];
    return { mobileColumns, desktopColumns };
}

