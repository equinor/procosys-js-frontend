import {
    Cell,
    CellProps,
    ColumnInstance,
    HeaderProps,
    Hooks,
    TableInstance,
    TableOptions,
    useFilters,
    useFlexLayout,
    usePagination,
    useResizeColumns,
    useRowSelect,
    useSortBy,
    useTable,
} from 'react-table';
import {
    HeaderCheckbox,
    LoadingDiv,
    RowCheckbox,
    Table,
    TableCell,
    TableHeadCell,
    TableHeadFilterCell,
    TableHeader,
    TableRow,
} from './style';
import { VariableSizeList as List, VariableSizeList } from 'react-window';
import React, {
    CSSProperties,
    PropsWithChildren,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';
import { DefaultColumnFilter } from './filters';
import { ResizeHandle } from './ResizeHandle';
import Spinner from '../Spinner';
import { TablePagination } from './TablePagination';
import { Typography } from '@equinor/eds-core-react';
import { TableSortLabel } from '@mui/material';

export interface DataQuery {
    pageSize: number;
    pageIndex: number;
    orderField: string;
    orderDirection: string;
}

export interface TableSorting {
    id: string;
    desc: boolean;
}

interface AutoSizerProps {
    height: number;
    width: number;
}

export interface TableProperties<T extends Record<string, unknown>>
    extends TableOptions<T> {
    columns: ColumnInstance<T>[];
    pageCount: number;
    loading: boolean;
    data: T[];
    maxRowCount: number;
    pageSize: number;
    pageIndex: number;
    onSelectedChange?: (args: T[], ids: Record<string, boolean>) => void;
    onSort?: (sorting: TableSorting) => void;
    clientPagination?: boolean;
    clientSorting?: boolean;
    selectedRows?: Record<string, boolean>;
    rowSelect?: boolean;
    toolbarText?: string;
    toolbarColor?: string;
    orderBy?: TableSorting;
    setPageIndex?: (ix: number) => void;
    setPageSize?: (size: number) => void;
    noHeader?: boolean;
    toolbar?: React.ComponentType<any>;
    disableSelectAll?: boolean;
    disablePagination?: boolean;
}

const selectionHook = (hooks: Hooks<Record<string, unknown>>): void => {
    hooks.allColumns.push((columns) => [
        {
            id: 'selection',
            disableResizing: true,
            disableGroupBy: true,
            minWidth: 50,
            width: 50,
            maxWidth: 50,
            Header: ({
                getToggleAllRowsSelectedProps,
                disableSelectAll,
                rows,
                toggleRowSelected,
            }: HeaderProps<Record<string, unknown>>): JSX.Element => {
                //Remove on change form selectAllprops
                const { onChange, ...propsWithoutOnChange } =
                    getToggleAllRowsSelectedProps();
                //Function to select all rows where checkbox isn't disabled
                const overridenOnChange = (): void => {
                    rows.forEach((row) => {
                        if (!row.original.disableCheckbox) {
                            let toggleTo = true;
                            if (
                                propsWithoutOnChange.checked ||
                                propsWithoutOnChange.indeterminate
                            )
                                toggleTo = false;
                            toggleRowSelected(row.id, toggleTo);
                        }
                    });
                };

                //Redefined props
                const newProps = {
                    onChange: overridenOnChange,
                    ...propsWithoutOnChange,
                };
                return (
                    <HeaderCheckbox {...newProps} disabled={disableSelectAll} />
                );
            },
            Cell: ({ row }: CellProps<Record<string, unknown>>): JSX.Element =>
                row.original.noCheckbox ? (
                    <></>
                ) : (
                    <RowCheckbox
                        disabled={row.original.disableCheckbox}
                        {...row.getToggleRowSelectedProps()}
                    />
                ),
        },
        ...columns,
    ]);
};

const ProcosysTable = forwardRef(
    (
        props: PropsWithChildren<TableProperties<Record<string, unknown>>>,
        ref: any
    ) => {
        const defaultColumn = React.useMemo(
            () => ({
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const [counter, _setCounter] = useState<number>(1);
        const [rendered, setRendered] = useState<boolean>(false);
        const counterRef = useRef<number>(counter);

        const setCounter = (newValue: number): void => {
            rowHeights.current = {};
            setTimeout(() => {
                counterRef.current = newValue;
                _setCounter(newValue);
            }, 200);
        };

        const hasFilters = (): boolean => {
            let i = 0;
            let filterFound = false;
            while (i < headerGroups.length && !filterFound) {
                filterFound =
                    headerGroups[i].headers.filter((h) => h.filter).length > 0;
                i++;
            }
            return filterFound;
        };

        const hooks = [];
        hooks.push(
            useFlexLayout,
            useFilters,
            useSortBy,
            usePagination,
            useResizeColumns,
            useRowSelect
        );

        if (props.rowSelect) {
            hooks.push(selectionHook);
        }

        const tableInstance = useTable<Record<string, unknown>>(
            {
                ...props,
                manualPagination: props.clientPagination ? false : true,
                defaultColumn,
                manualSortBy: props.clientSorting ? false : true,
                initialState: {
                    pageIndex: props.pageIndex,
                    pageSize: props.disablePagination
                        ? props.data.length || props.pageSize
                        : props.pageSize,
                    selectedRowIds: props.selectedRows || {},
                    disableSelectAll: props.disableSelectAll,
                    sortBy: props.orderBy
                        ? [props.orderBy]
                        : [{ id: 'createdAt', desc: true }],
                },
            },
            ...hooks
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            prepareRow,
            page,
            onClick,
            loading = props.loading,
            selectedFlatRows,
            state: { pageIndex, pageSize, selectedRowIds, sortBy },
        } = tableInstance;

        useEffect(() => {
            if (
                sortBy.length > 0 &&
                tableInstance.onSort &&
                (sortBy[0].id !== props.orderBy?.id ||
                    sortBy[0].desc !== props.orderBy?.desc)
            ) {
                tableInstance.onSort(sortBy[0]);
                setRendered(true);
            }
            if (sortBy.length === 0 && tableInstance.onSort) {
                if (rendered) {
                    tableInstance.onSort([]);
                }
            }
        }, [tableInstance.onSort, sortBy]);

        useEffect(() => {
            if (tableInstance.state.columnResizing.isResizingColumn === null) {
                rowHeights.current = {};
                setCounter(counter + 1);
            }
        }, [tableInstance.state.columnResizing.isResizingColumn]);

        useEffect(() => {
            if (props.onSelectedChange) {
                const selectedRows = tableInstance.data.filter(
                    (d: Record<string, unknown>, ix: number) => {
                        return (
                            Object.keys(selectedRowIds)
                                .map(Number)
                                .indexOf(ix) >= 0
                        );
                    }
                );

                props.onSelectedChange(selectedRows, selectedRowIds);
            }
        }, [selectedFlatRows.length]);

        useImperativeHandle(ref, () => ({
            UnselectRow(rowIndex: number): void {
                tableInstance.rows[rowIndex].toggleRowSelected();
            },
        }));

        useEffect(() => {
            if (props.setPageIndex) {
                props.setPageIndex(pageIndex);
            }
            rowHeights.current = {};
            setCounter(counter + 1);
        }, [pageIndex]);

        useEffect(() => {
            if (props.setPageSize) {
                props.setPageSize(pageSize);
            }
            tableInstance.state.pageSize = pageSize;
            rowHeights.current = {};

            setCounter(counter + 1);
        }, [pageSize]);

        const cellClickHandler =
            (cell: Cell<Record<string, unknown>>) => (): void => {
                onClick && cell.column.id !== 'selection' && onClick(cell.row);
            };

        const RenderRow = ({
            index,
            style,
        }: {
            index: number;
            style: React.CSSProperties;
        }): JSX.Element | null => {
            const row = page[index];
            if (!row) return null;
            const rowRef = useRef<HTMLDivElement>({} as HTMLDivElement);

            useEffect(() => {
                if (
                    rowRef.current &&
                    (rowHeights.current[index] == 40 ||
                        rowHeights.current[index] === undefined)
                ) {
                    let maxValue = 32;
                    const children = rowRef.current.children;

                    for (let i = 0; i < children.length; i++) {
                        const child = children[i];
                        if (child.clientHeight > maxValue)
                            maxValue = child.clientHeight;

                        const grandChildren = child.children;
                        for (let ci = 0; ci < grandChildren.length; ci++) {
                            const grandChild = grandChildren[ci];
                            if (grandChild.clientHeight > maxValue)
                                maxValue = grandChild.clientHeight;
                        }
                    }

                    setRowHeight(index, maxValue < 40 ? 40 : maxValue + 14);
                }
            }, [rowRef]);

            prepareRow(row);

            return (
                <TableRow
                    ref={rowRef}
                    selected={!row.original.noCheckbox && row.isSelected}
                    {...row.getRowProps({ style })}
                >
                    {row.cells.map((cell) => (
                        <TableCell
                            align={cell.column.align}
                            {...cell.getCellProps()}
                            key={cell.getCellProps().key}
                            onClick={cellClickHandler(cell)}
                        >
                            {cell.render('Cell')}
                        </TableCell>
                    ))}
                </TableRow>
            );
        };

        const listRef = useRef<VariableSizeList>({} as VariableSizeList);
        const headerRef = useRef<HTMLDivElement>(null);
        const headerFiltersRef = useRef<HTMLDivElement>(null);
        const rowHeights = useRef<any>({});

        const scrollHeader = (props: Event): void => {
            if (headerRef.current) {
                headerRef.current.scrollLeft =
                    // eslint-disable-next-line
                    (props.target as Element).scrollLeft;
            }

            if (headerFiltersRef.current) {
                headerFiltersRef.current.scrollLeft =
                    // eslint-disable-next-line
                    (props.target as Element).scrollLeft;
            }
        };

        const addScrollEventHandler = (): void => {
            // fix to make table-header scroll with list
            setTimeout(() => {
                if (listRef && listRef.current) {
                    (listRef.current as any)._outerRef.onscroll = scrollHeader;
                }
            }, 50);

            // fix to set header width when no scroll-bar
            setTimeout(() => {
                if (listRef.current && listRef.current) {
                    if (
                        (listRef.current as any)._outerRef.scrollHeight <=
                        (listRef.current as any)._outerRef.clientHeight
                    ) {
                        if (headerRef && headerRef.current) {
                            headerRef.current.style.width =
                                parseInt(
                                    headerRef.current.style.width.replace(
                                        'px',
                                        ''
                                    )
                                ) +
                                8 +
                                'px';
                        }

                        if (headerFiltersRef && headerFiltersRef.current) {
                            headerFiltersRef.current.style.width =
                                parseInt(
                                    headerFiltersRef.current.style.width.replace(
                                        'px',
                                        ''
                                    )
                                ) +
                                8 +
                                'px';
                        }
                    }
                }
            }, 50);
        };

        function getRowHeight(index: number): number {
            return rowHeights.current[index] || 40;
        }

        const getItemCount = (
            tableInstance: TableInstance<Record<string, unknown>>
        ): number => {
            let itemCount = 0;
            if (props.disablePagination) {
                return tableInstance.filteredRows.length;
            } else {
                if (props.clientPagination) {
                    if (tableInstance.state.pageIndex > 0) {
                        const itemsStartIndex =
                            tableInstance.state.pageSize *
                            tableInstance.state.pageIndex;
                        const itemsEndIndex =
                            itemsStartIndex + tableInstance.state.pageSize;
                        if (tableInstance.filteredRows.length > itemsEndIndex)
                            itemCount = tableInstance.state.pageSize;
                        else {
                            itemCount =
                                tableInstance.filteredRows.length -
                                itemsStartIndex;
                        }
                    } else {
                        if (
                            tableInstance.filteredRows.length <
                            tableInstance.state.pageSize
                        ) {
                            itemCount = tableInstance.filteredRows.length;
                        } else {
                            itemCount = tableInstance.state.pageSize;
                        }
                    }
                } else {
                    if (
                        tableInstance.filteredRows.length <
                        tableInstance.state.pageSize
                    ) {
                        itemCount = tableInstance.filteredRows.length;
                    } else {
                        itemCount = tableInstance.state.pageSize;
                    }
                }
            }
            return itemCount;
        };

        useEffect(() => {
            const reRenderTable = (): void => {
                setCounter(counterRef.current + 1);
            };
            window.addEventListener('resize', reRenderTable);

            return (): void => {
                window.removeEventListener('resize', reRenderTable);
            };
        }, []);

        function setRowHeight(index: number, size: number): void {
            listRef.current.resetAfterIndex(0);
            rowHeights.current = { ...rowHeights.current, [index]: size };
        }

        return loading ? (
            <LoadingDiv>
                <Spinner large />
            </LoadingDiv>
        ) : (
            <AutoSizer style={{ height: '100%', width: '100%' }}>
                {({ height, width }: AutoSizerProps): JSX.Element => (
                    <div>
                        <div
                            style={{ justifyContent: 'flex-end', width: width }}
                        >
                            {props.toolbar ? props.toolbar : null}
                            {props.toolbarText && (
                                <Typography
                                    style={{
                                        color: props.toolbarColor,
                                        width: 'max-content',
                                    }}
                                    variant="h6"
                                >
                                    {props.toolbarText}
                                </Typography>
                            )}
                        </div>
                        <Table key={counter} {...getTableProps()}>
                            {!props.noHeader &&
                                // render table header
                                headerGroups.map((headerGroup, i) => (
                                    <TableHeader
                                        {...headerGroup.getHeaderGroupProps()}
                                        key={
                                            headerGroup.getHeaderGroupProps()
                                                .key
                                        }
                                        ref={headerRef}
                                        style={{
                                            width: width - 18,
                                            display: 'flex',
                                        }}
                                    >
                                        {headerGroup.headers.map((column) => {
                                            const style = {
                                                textAlign: column.align
                                                    ? column.align
                                                    : 'left ',
                                            } as CSSProperties;

                                            return (
                                                <TableHeadCell
                                                    align={column.align}
                                                    {...column.getHeaderProps()}
                                                    key={
                                                        column.getHeaderProps()
                                                            .key
                                                    }
                                                >
                                                    <div>
                                                        {column.canSort &&
                                                        column.defaultCanSort !==
                                                            false ? (
                                                            <TableSortLabel
                                                                active={
                                                                    column.isSorted ||
                                                                    (props
                                                                        .orderBy
                                                                        ?.id !==
                                                                        undefined &&
                                                                        column.id ===
                                                                            props.orderBy?.id.toString())
                                                                }
                                                                direction={
                                                                    props
                                                                        .orderBy
                                                                        ?.id !==
                                                                        undefined &&
                                                                    column.id ===
                                                                        props.orderBy?.id.toString()
                                                                        ? props
                                                                              .orderBy
                                                                              ?.desc
                                                                            ? 'desc'
                                                                            : 'asc'
                                                                        : column.isSortedDesc
                                                                          ? 'desc'
                                                                          : 'asc'
                                                                }
                                                                {...column.getSortByToggleProps()}
                                                            >
                                                                {column.render(
                                                                    'Header'
                                                                )}
                                                            </TableSortLabel>
                                                        ) : (
                                                            <div style={style}>
                                                                {column.render(
                                                                    'Header'
                                                                )}
                                                            </div>
                                                        )}
                                                        {column.canResize && (
                                                            <ResizeHandle
                                                                column={column}
                                                            />
                                                        )}
                                                    </div>
                                                </TableHeadCell>
                                            );
                                        })}
                                    </TableHeader>
                                ))}
                            {!props.noHeader &&
                                // show client side filtering if any cols specify it
                                hasFilters() &&
                                headerGroups.map((headerGroup, i) => (
                                    <TableHeader
                                        {...headerGroup.getHeaderGroupProps()}
                                        key={
                                            headerGroup.getHeaderGroupProps()
                                                .key
                                        }
                                        ref={headerFiltersRef}
                                        style={{
                                            width: width - 18,
                                            display: 'flex',
                                        }}
                                    >
                                        {headerGroup.headers.filter(
                                            (c) => c.filter
                                        ).length > 0 &&
                                            headerGroup.headers.map(
                                                (column) => {
                                                    return (
                                                        <TableHeadFilterCell
                                                            {...column.getHeaderProps()}
                                                            key={
                                                                column.getHeaderProps()
                                                                    .key
                                                            }
                                                        >
                                                            {column.filter &&
                                                                column.render(
                                                                    'Filter'
                                                                )}
                                                        </TableHeadFilterCell>
                                                    );
                                                }
                                            )}
                                    </TableHeader>
                                ))}

                            {/* render table */}
                            <div {...getTableBodyProps()}>
                                {props.data.length === 0 && (
                                    <div>No records to display</div>
                                )}
                                <List
                                    height={height - 60}
                                    itemCount={getItemCount(tableInstance)}
                                    itemSize={getRowHeight}
                                    width={width}
                                    ref={listRef}
                                    onItemsRendered={addScrollEventHandler}
                                >
                                    {RenderRow}
                                </List>
                                <div style={{ width: width }}>
                                    <TablePagination<Record<string, unknown>>
                                        instance={tableInstance}
                                    />
                                </div>
                            </div>
                        </Table>
                    </div>
                )}
            </AutoSizer>
        );
    }
);

export default ProcosysTable;
