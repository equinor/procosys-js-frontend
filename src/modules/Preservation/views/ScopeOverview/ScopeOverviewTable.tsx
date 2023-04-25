import {
    Container,
    SingleIconContainer,
    TagLink,
    TagStatusLabel,
    TableRow,
    ReqIcon,
} from '@procosys/modules/Preservation/views/ScopeOverview/ScopeOverviewTable.style';
import {
    PreservedTag,
    PreservedTags,
} from '@procosys/modules/Preservation/views/ScopeOverview/types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ColumnInstance, TableOptions, UseTableRowProps } from 'react-table';
import { getFirstUpcomingRequirement, isTagOverdue } from './ScopeOverview';

import EdsIcon from '@procosys/components/EdsIcon';
import ProcosysTable from '@procosys/components/Table';
import RequirementIcons from '@procosys/modules/Preservation/views/ScopeOverview/RequirementIcons';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import { JSXBreakpoints } from '@procosys/core/styling';
import { Tooltip } from '@mui/material';
import getColumns from './GetColumns';

interface ScopeOverviewTableProps {
    getData: (
        page: number,
        pageSize: number,
        orderBy: string | null,
        orderDirection: string | null
    ) => Promise<PreservedTags | undefined>;
    setRefreshScopeListCallback: (
        callback: (maxHeight: number, refreshOnResize?: boolean) => void
    ) => void;
    pageSize: number;
    pageIndex: number;
    showTagDetails: (tag: PreservedTag) => void;
    setSelectedTags: (tags: PreservedTag[]) => void;
    selectedTags: PreservedTag[];
    setOrderByField: (orderByField: string | null) => void;
    setOrderDirection: (orderDirection: string | null) => void;
}

const ScopeOverviewTable = (props: ScopeOverviewTableProps): JSX.Element => {
    enum ActionStatus {
        Closed = 'HasClosed',
        Open = 'HasOpen',
        OverDue = 'HasOverdue',
    }

    const getRequirementColumn = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                return (
                    <ReqIcon
                        isOverdue={isTagOverdue(tag)}
                        tag={tag}
                        onClick={(): void => props.showTagDetails(tag)}
                    >
                        <RequirementIcons tag={tag} />
                    </ReqIcon>
                );
            },
        []
    );

    const getResponsibleColumn = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                return (
                    <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                        <Tooltip
                            title={tag.responsibleDescription || ''}
                            arrow={true}
                            enterDelay={200}
                            enterNextDelay={100}
                        >
                            <div>{tag.responsibleCode}</div>
                        </Tooltip>
                    </TableRow>
                );
            },
        []
    );

    const getDueColumn = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const requirement = getFirstUpcomingRequirement(
                    row.value as PreservedTag
                );
                const tag = row.value as PreservedTag;
                return (
                    <TableRow
                        isOverdue={
                            requirement && isTagOverdue(tag) ? true : false
                        }
                        tag={tag}
                    >
                        {!requirement || tag.isVoided
                            ? null
                            : requirement.nextDueWeeks}
                    </TableRow>
                );
            },
        []
    );

    const getNextColumn = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const requirement = getFirstUpcomingRequirement(
                    row.value as PreservedTag
                );
                const tag = row.value as PreservedTag;
                return (
                    <TableRow
                        isOverdue={
                            requirement && isTagOverdue(tag) ? true : false
                        }
                        tag={tag}
                    >
                        {!requirement || tag.isVoided
                            ? null
                            : requirement.nextDueAsYearAndWeek}
                    </TableRow>
                );
            },
        []
    );

    const getActionsHeader = (): JSX.Element => {
        return (
            <SingleIconContainer>
                <EdsIcon
                    name="notifications"
                    size={24}
                    color={tokens.colors.text.static_icons__tertiary.rgba}
                />
            </SingleIconContainer>
        );
    };

    const getActionsColumn = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                if (
                    !tag.actionStatus ||
                    tag.actionStatus === ActionStatus.Closed
                ) {
                    return <div></div>;
                }

                return (
                    <TagLink isOverdue={isTagOverdue(tag)} tag={tag}>
                        <Tooltip
                            title={
                                tag.actionStatus === ActionStatus.OverDue
                                    ? 'Overdue action(s)'
                                    : 'Open action(s)'
                            }
                            arrow={true}
                            enterDelay={200}
                            enterNextDelay={100}
                        >
                            <SingleIconContainer>
                                <div>
                                    <EdsIcon
                                        name="notifications"
                                        size={24}
                                        color={
                                            tag.actionStatus ===
                                            ActionStatus.OverDue
                                                ? tokens.colors.interactive
                                                      .danger__text.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                </div>
                            </SingleIconContainer>
                        </Tooltip>
                    </TagLink>
                );
            },
        []
    );

    const getTagNoColumn = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                return (
                    <TagLink
                        isOverdue={isTagOverdue(tag)}
                        tag={tag}
                        onClick={(): void => props.showTagDetails(tag)}
                    >
                        <Tooltip
                            title={tag.tagNo || ''}
                            arrow={true}
                            enterDelay={200}
                            enterNextDelay={100}
                        >
                            <span>{tag.tagNo}</span>
                        </Tooltip>
                    </TagLink>
                );
            },
        []
    );

    const getDescriptionColumn = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                return (
                    <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                        <Tooltip
                            title={tag.description || ''}
                            arrow={true}
                            enterDelay={200}
                            enterNextDelay={100}
                        >
                            <div>
                                {tag.description}
                                {tag.isNew && (
                                    <TagStatusLabel role="new-indicator">
                                        new
                                    </TagStatusLabel>
                                )}
                            </div>
                        </Tooltip>
                    </TableRow>
                );
            },
        []
    );

    const getPOColumn = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                return (
                    <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                        <Tooltip
                            title={
                                tag.calloffNo
                                    ? `${tag.purchaseOrderNo}/${tag.calloffNo}`
                                    : tag.purchaseOrderNo
                                    ? tag.purchaseOrderNo
                                    : ''
                            }
                            arrow={true}
                            enterDelay={200}
                            enterNextDelay={100}
                        >
                            <div>
                                {tag.calloffNo
                                    ? `${tag.purchaseOrderNo}/${tag.calloffNo}`
                                    : tag.purchaseOrderNo}
                            </div>
                        </Tooltip>
                    </TableRow>
                );
            },
        []
    );

    const getAreaCode = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                return (
                    <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                        {tag.areaCode}
                    </TableRow>
                );
            },
        []
    );

    const getDisciplineCode = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                return (
                    <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                        {tag.disciplineCode}
                    </TableRow>
                );
            },
        []
    );

    const getMode = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.value as PreservedTag;
                return (
                    <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                        {tag.mode}
                    </TableRow>
                );
            },
        []
    );

    const getStatus = useMemo(
        () =>
            (row: TableOptions<PreservedTag>): JSX.Element => {
                const tag = row.row.original as PreservedTag;

                return (
                    <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                        {tag.status}
                    </TableRow>
                );
            },
        []
    );

    const { mobileColumns, desktopColumns } = getColumns(
        getTagNoColumn,
        getDescriptionColumn,
        getDueColumn,
        getNextColumn,
        getMode,
        getPOColumn,
        getAreaCode,
        getResponsibleColumn,
        getDisciplineCode,
        getStatus,
        getRequirementColumn,
        getActionsHeader,
        getActionsColumn
    );

    const [maxRows, setMaxRows] = useState<number>(0);

    const [pageIndex, setPageIndex] = useState(props.pageIndex);
    const [pageSize, setPageSize] = useState(props.pageSize);
    const fetchIdRef = useRef(0);
    const tableRef = useRef();
    const [sortBy, setSortBy] = useState<{
        id: string | undefined;
        desc: boolean;
    }>({ id: 'due', desc: false });
    const [data, setData] = useState<PreservedTag[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [columns, _setColumns] = useState<ColumnInstance<any>[]>([]);
    const columnsRef = useRef<ColumnInstance<any>[]>(columns);
    const [firstRender, setFirstRender] = useState<boolean>(true);

    const setColumns = (newValue: any[]): void => {
        columnsRef.current = newValue;
        _setColumns(newValue);
    };

    const getData = async (
        { tablePageIndex, tablePageSize }: any,
        sortField = 'due',
        sortDir = 'asc'
    ): Promise<void> => {
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
            await props
                .getData(tablePageIndex, tablePageSize, sortField, sortDir)
                .then((res) => {
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
        props.setRefreshScopeListCallback(
            (maxHeight?: number, refreshOnResize = false) => {
                const req = { tablePageIndex: 0, tablePageSize: pageSize };
                setPageIndex(0);
                getData(req);
            }
        );
        setFirstRender(false);
    }, []);

    useEffect(() => {
        if (!firstRender) {
            getData(
                { tablePageIndex: pageIndex, tablePageSize: pageSize },
                sortBy.id,
                sortBy.desc ? 'desc' : 'asc'
            );
        }
    }, [pageSize, sortBy, pageIndex]);

    const setSorting = (input: { id: string; desc: boolean }): void => {
        if (input) {
            if (sortBy.id !== input.id || sortBy.desc !== input.desc) {
                setSortBy(input);
                props.setOrderByField(input.id);
            }
        } else if (sortBy.id) {
            setSortBy({ id: undefined, desc: false });
        }
    };

    return (
        <Container>
            <Typography variant="body_long">
                {props.selectedTags.length} tags selected
            </Typography>
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
                pageCount={0}
            />
        </Container>
    );
};

export default ScopeOverviewTable;
