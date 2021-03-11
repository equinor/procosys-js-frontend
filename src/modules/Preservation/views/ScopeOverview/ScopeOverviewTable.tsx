import { Container, SingleIconContainer, TagLink } from '@procosys/modules/Preservation/views/ScopeOverview/ScopeOverviewTable.style';
import { PreservedTag, PreservedTags } from '@procosys/modules/Preservation/views/ScopeOverview/types';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { TableOptions, UseTableInstanceProps, UseTableRowProps } from 'react-table';
import { getFirstUpcomingRequirement, isTagOverdue, isTagVoided } from './ScopeOverview';

import EdsIcon from '@procosys/components/EdsIcon';
import ProcosysTable from '@procosys/components/Table/ProcosysTable';
import RequirementIcons from '@procosys/modules/Preservation/views/ScopeOverview/RequirementIcons';
import { Tooltip } from '@material-ui/core';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

interface ScopeOverviewTableProps {
    getData: (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null) => Promise<PreservedTags>;
    setRefreshScopeListCallback: (callback: (maxHeight: number, refreshOnResize?: boolean) => void) => void;
    pageSize: number;
    pageIndex: number;
    showTagDetails: (tag: PreservedTag) => void;
    setSelectedTags: (tags: PreservedTag[]) => void;
    selectedTags: PreservedTag[];
    setOrderByField: (orderByField: string | null) => void;
    setOrderDirection: (orderDirection: string | null) => void;
}

const ScopeOverviewTable = forwardRef((props: ScopeOverviewTableProps, ref) => {

    enum ActionStatus {
        Closed = 'HasClosed',
        Open = 'HasOpen',
        OverDue = 'HasOverdue'
    }

    const getRequirementColumn = React.memo(function getRequirementColumn(row: TableOptions<PreservedTag>): JSX.Element {
        const tag = row.value as PreservedTag;
        return (
            <div
                style={{ cursor: 'pointer', opacity: tag.isVoided ? '0.5' : '1' }}

                onClick={(): void => props.showTagDetails(tag)} >
                <RequirementIcons tag={tag} />
            </ div>
        );
    });

    const getResponsibleColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <Tooltip title={tag.responsibleDescription} arrow={true} enterDelay={200} enterNextDelay={100}>
                <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>{tag.responsibleCode}</div>
            </Tooltip>
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
                <span style={{ color: 'inherit', opacity: tag.isVoided ? '0.5' : '1' }}>{tag.tagNo}</span>
            </TagLink>
        );
    }, []);

    const getDescriptionColumn = useMemo(() => (row: TableOptions<PreservedTag>): JSX.Element => {
        const tag = row.value as PreservedTag;
        return (
            <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>
                {tag.description}
            </div>
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
        const tag = row.value as PreservedTag;
        return (
            <div className='controlOverflow' style={{ color: isTagOverdue(tag) ? tokens.colors.interactive.danger__text.rgba : 'rgba(0, 0, 0, 1)', opacity: tag.isVoided ? '0.5' : '1' }}>
                {tag.status}
            </div>);
    }, []);


    const columns = React.useMemo(() => [
        {
            Header: 'Tag nr',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'tagNo',
            Cell: getTagNoColumn,
            width: 180,
            maxWidth: 400,
            minWidth: 150,
            filter: (rows: UseTableRowProps<PreservedTag>[], id: number, filterType: string): UseTableRowProps<PreservedTag>[] => {
                return rows.filter((row) => { return row.original.tagNo.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
            }
        },
        {
            Header: 'Description',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getDescriptionColumn,
            width: 250,
            maxWidth: 400,
            minWidth: 150,
            filter: (rows: UseTableRowProps<PreservedTag>[], id: number, filterType: string): UseTableRowProps<PreservedTag>[] => {
                return rows.filter((row) => { return row.original.description.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
            }
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
            filter: (rows: UseTableRowProps<PreservedTag>[], id: number, filterType: string): UseTableRowProps<PreservedTag>[] => {
                return rows.filter((row) => { return row.original.mode.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
            }
        },
        {
            Header: 'PO',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'PO',
            Cell: getPOColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
            filter: (rows: UseTableRowProps<PreservedTag>[], id: number, filterType: string): UseTableRowProps<PreservedTag>[] => {
                return rows.filter((row) => {
                    if (row.original.purchaseOrderNo) {
                        if (row.original.calloffNo) {
                            const searchField = `${row.original.purchaseOrderNo}/${row.original.calloffNo}`;
                            return searchField.toLowerCase().indexOf(filterType.toLowerCase()) > -1;
                        } else {
                            return row.original.purchaseOrderNo.toLowerCase().indexOf(filterType.toLowerCase()) > -1;
                        }
                    }
                }
                );
            }
        },
        {
            Header: 'Area',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            id: 'Area',
            Cell: getAreaCode,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
            filter: (rows: UseTableRowProps<PreservedTag>[], id: number, filterType: string): UseTableRowProps<PreservedTag>[] => {
                return rows.filter((row) => { return row.original.areaCode.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
            }
        },
        {
            Header: 'Resp',
            id: 'responsible',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getResponsibleColumn,
            filter: (rows: UseTableRowProps<PreservedTag>[], id: number, filterType: string): UseTableRowProps<PreservedTag>[] => {
                return rows.filter((row) => { return row.original.responsibleCode.toLowerCase().indexOf(filterType.toLowerCase()) > -1 || row.original.responsibleDescription.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
            }
        },
        {
            Header: 'Disc',
            id: 'discipline',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
            Cell: getDisciplineCode
        },
        {
            Header: 'Status',
            accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
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

    ], []);

    const [data, setData] = useState<PreservedTag[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageCount, setPageCount] = useState<number>(0);
    const [maxRows, setMaxRows] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState(props.pageIndex);
    const [pageSize, setPageSize] = useState(props.pageSize);
    const fetchIdRef = useRef(0);
    const tableRef = useRef();
    const [sortBy, setSortBy] = useState({ id: null, desc: false });

    const getData = ({ pageIndex, pageSize }: any, sortField = 'Due', sortDir = 'asc'): void => {
        if (!pageSize && !pageIndex) return;
        const fetchId = ++fetchIdRef.current;
        setLoading(true);

        if (sortBy.id) {
            sortField = (sortBy as any).id;
            sortDir = sortBy.desc ? 'desc' : 'asc';
            props.setOrderByField(sortField);
            props.setOrderDirection(sortDir);
        }

        if (fetchId === fetchIdRef.current) {
            props.getData(pageIndex, pageSize, sortField, sortDir).then((res) => {
                setData(res.tags);
                setMaxRows(res.maxAvailable);
                setPageCount(Math.ceil(res.maxAvailable / pageSize));
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        if (sortBy.id) {
            getData({ pageIndex: 0, pageSize: pageSize }, (sortBy as any).id, sortBy.desc ? 'desc' : 'asc');
            props.setOrderByField(sortBy.id);
            props.setOrderDirection(sortBy.desc ? 'desc' : 'asc');
        } else {
            getData({ pageIndex: 0, pageSize: pageSize });
        }

    }, [sortBy]);

    useEffect(() => {
        props.setRefreshScopeListCallback((maxHeight?: number, refreshOnResize = false) => {
            const req = { pageIndex: 0, pageSize: pageSize };
            setPageIndex(0);
            if (tableRef.current)
                ((tableRef.current) as any).resetPageIndex(true);
            getData(req);
        });
    });

    const setSorting = (input: any[]): void => {
        if (input.length > 0 && sortBy && (sortBy.id !== input[0].id || sortBy.desc !== input[0].desc)) {
            setSortBy(input[0]);
            props.setOrderByField(input[0]);
        }
        if (input.length === 0 && sortBy.id) {
            setSortBy({ id: null, desc: false });
        }
    };

    return (
        <Container>
            <Typography variant='body_long'>{props.selectedTags.length} tags selected</Typography>
            <ProcosysTable
                setPageSize={setPageSize}
                onSort={setSorting}
                onSelectedChange={props.setSelectedTags}
                ref={tableRef}
                pageIndex={pageIndex}
                pageSize={pageSize}
                columns={columns}
                maxRowCount={maxRows}
                data={data}
                fetchData={getData}
                loading={loading}
                pageCount={pageCount} />
        </Container>
    );

});

export default ScopeOverviewTable;

