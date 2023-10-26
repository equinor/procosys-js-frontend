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
import { AgGridReact } from '@ag-grid-community/react';
import useStyles from '@equinor/fusion-react-ag-grid-styles';
import { createComponent } from '@equinor/fusion-framework-react-app';
import { enableAgGrid } from '@equinor/fusion-framework-module-ag-grid';
import { ColDef, ColGroupDef, ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

createComponent((config): any => {
    enableAgGrid(config);
});

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
    const styles = useStyles();

    const AGColumns: ColDef[] | ColGroupDef = useMemo(
        () => [
            {
                field: 'tagNo',
            },
        ],
        []
    );
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
    const [columns, _setColumns] = useState<ColDef[] | ColGroupDef<any>[]>([]);
    const columnsRef = useRef<ColDef[] | ColGroupDef<any>[]>(columns);
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
        if (!firstRender) {
            props.setRefreshScopeListCallback(
                (maxHeight?: number, refreshOnResize = false) => {
                    const req = { tablePageIndex: 0, tablePageSize: pageSize };
                    setPageIndex(0);
                    getData(req);
                }
            );
        }
    });

    useEffect(() => {
        getData(
            { tablePageIndex: pageIndex, tablePageSize: pageSize },
            sortBy.id,
            sortBy.desc ? 'desc' : 'asc'
        );
        setFirstRender(false);
    }, [pageSize, sortBy, pageIndex]);

    console.log(data);
    console.log(columns);

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

    const AGgetTagNoColumn =
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
        };

    const AGColumnDefs: ColDef[] | ColGroupDef = useMemo(
        () => [
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
                showDisabledCheckboxes: true,
                width: 200,
                maxWidth: 150,
                minWidth: 30,
                headerName: 'Tag No',
                cellRenderer: (tag: any): JSX.Element => {
                    return (
                        <TagLink
                            isOverdue={isTagOverdue(tag.data)}
                            tag={tag.data}
                            onClick={(): void => props.showTagDetails(tag.data)}
                        >
                            <Tooltip
                                title={tag.value || ''}
                                arrow={true}
                                enterDelay={200}
                                enterNextDelay={100}
                            >
                                <span>{tag.value}</span>
                            </Tooltip>
                        </TagLink>
                    );
                },
                field: 'tagNo',
            },
            {
                width: 200,
                maxWidth: 200,
                minWidth: 30,
                headerName: 'Description',
                cellRenderer: (tag: any): JSX.Element => {
                    return (
                        <TableRow
                            isOverdue={isTagOverdue(tag.data)}
                            tag={tag.data}
                        >
                            <Tooltip
                                title={tag.value || ''}
                                arrow={true}
                                enterDelay={200}
                                enterNextDelay={100}
                            >
                                <div>
                                    {tag.value}
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
                field: 'description',
            },
            {
                width: 100,
                maxWidth: 100,
                minWidth: 30,
                headerName: 'Due',
                cellRenderer: (row: any): JSX.Element => {
                    const requirement = getFirstUpcomingRequirement(
                        row.data as PreservedTag
                    );
                    const tag = row.data as PreservedTag;
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
                field: 'due',
            },
            {
                width: 100,
                maxWidth: 100,
                minWidth: 30,
                headerName: 'Next',
                field: 'due',
                cellRenderer: (row: any): JSX.Element => {
                    const requirement = getFirstUpcomingRequirement(
                        row.data as PreservedTag
                    );
                    const tag = row.data as PreservedTag;
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
            },
            {
                width: 100,
                maxWidth: 100,
                minWidth: 30,
                headerName: 'Mode',
                field: 'mode',
                cellRenderer: (row: any): JSX.Element => {
                    const tag = row.data as PreservedTag;
                    return (
                        <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                            {row.value}
                        </TableRow>
                    );
                },
            },
            {
                width: 100,
                maxWidth: 100,
                minWidth: 30,
                headerName: 'PO',
                cellRenderer: (row: any): JSX.Element => {
                    const tag = row.data as PreservedTag;
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
                field: 'PO',
            },
            {
                headerName: 'Area',
                Cell: (row: any): JSX.Element => {
                    const tag = row.data as PreservedTag;
                    return (
                        <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                            {tag.areaCode}
                        </TableRow>
                    );
                },
                field: 'Area',
                width: 100,
                maxWidth: 100,
                minWidth: 30,
            },
            {
                width: 100,
                maxWidth: 100,
                minWidth: 30,
                headerName: 'Resp',
                cellRenderer: (row: any): JSX.Element => {
                    const tag = row.data as PreservedTag;
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
                field: 'responsible',
            },
            {
                width: 100,
                maxWidth: 100,
                minWidth: 30,
                headerName: 'Disc',
                cellRenderer: (row: any): JSX.Element => {
                    const tag = row.data as PreservedTag;
                    return (
                        <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                            {tag.disciplineCode}
                        </TableRow>
                    );
                },
                field: 'discipline',
            },
            {
                width: 100,
                maxWidth: 100,
                minWidth: 30,
                headerName: 'Status',
                cellRenderer: (row: any): JSX.Element => {
                    const tag = row.data as PreservedTag;

                    return (
                        <TableRow isOverdue={isTagOverdue(tag)} tag={tag}>
                            {tag.status}
                        </TableRow>
                    );
                },
                field: 'status',
            },
            {
                width: 100,
                maxWidth: 100,
                minWidth: 30,
                headerName: 'Req type',
                cellRenderer: (row: any): JSX.Element => {
                    const tag = row.data as PreservedTag;
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
                defaultCanSort: false,
                field: 'reqtype',
            },
            {
                headerGroupComponent: (): JSX.Element => {
                    return (
                        <SingleIconContainer>
                            <EdsIcon
                                name="notifications"
                                size={24}
                                color={
                                    tokens.colors.text.static_icons__tertiary
                                        .rgba
                                }
                            />
                        </SingleIconContainer>
                    );
                },
                cellRenderer: (row: any): JSX.Element => {
                    const tag = row.data as PreservedTag;
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
                sortable: false,
            },
        ],
        []
    );

    const agGridOptions = {
        defaultColDef: {
            resizable: true,
            sortable: true,
            filter: 'agTextColumnFilter',
        },
        rowSelection: 'multiple' as any,
        suppressRowClickSelection: true,
    };

    return (
        <Container>
            <Typography variant="body_long">
                {props.selectedTags.length} tags selected
            </Typography>
            <div
                className={[styles.root, 'ag-theme-alpine-fusion'].join(' ')}
                style={{ height: 800 }}
            >
                <AgGridReact
                    rowData={data}
                    columnDefs={AGColumnDefs}
                    gridOptions={agGridOptions}
                ></AgGridReact>
            </div>
            {/*<ProcosysTable
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
            />*/}
        </Container>
    );
};

export default ScopeOverviewTable;
