import {
    Cell,
    CellProps,
    ColumnInstance,
    HeaderProps,
    Hooks,
    TableOptions,
    useFilters,
    useFlexLayout,
    usePagination,
    useResizeColumns,
    useRowSelect,
    useSortBy,
    useTable
} from 'react-table';
import { FixedSizeList as List, areEqual, FixedSizeList } from 'react-window';
import React, { CSSProperties, PropsWithChildren, forwardRef, memo, useEffect, useRef, useImperativeHandle } from 'react';
import { Table, TableCell, TableHeadCell, TableHeadFilterCell, TableHeader, TableRow, HeaderCheckbox, RowCheckbox, LoadingDiv } from './style';

import AutoSizer from 'react-virtualized-auto-sizer';
import { DefaultColumnFilter } from './filters';
import { ResizeHandle } from './ResizeHandle';
import Spinner from '../Spinner';
import { TablePagination } from './TablePagination';
import { TableSortLabel } from '@material-ui/core';
import { Typography } from '@equinor/eds-core-react';

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

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
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
            Header: ({ getToggleAllRowsSelectedProps, disableSelectAll }: HeaderProps<Record<string, unknown>>): JSX.Element => (
                <HeaderCheckbox {...getToggleAllRowsSelectedProps()} disabled={disableSelectAll} />
            ),
            Cell: ({ row }: CellProps<Record<string, unknown>>): JSX.Element => row.original.noCheckbox ? <></> : <RowCheckbox disabled={row.original.disableCheckbox} {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
    ]);
};

const ProcosysTable = forwardRef(((props: PropsWithChildren<TableProperties<Record<string, unknown>>>, ref: any) => {
    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }), []
    );

    const hasFilters = (): boolean => {
        let i = 0;
        let filterFound = false;
        while (i < headerGroups.length && !filterFound) {
            filterFound = headerGroups[i].headers.filter((h) => h.filter).length > 0;
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
        useRowSelect);

    if (props.rowSelect) {
        hooks.push(
            selectionHook
        );
    }

    const tableInstance = useTable<Record<string, unknown>>(
        {
            ...props,
            manualPagination: props.clientPagination ? false : true,
            defaultColumn,
            manualSortBy: props.clientSorting ? false : true,
            initialState: { pageIndex: props.pageIndex, pageSize: props.pageSize, selectedRowIds: props.selectedRows || {}, disableSelectAll: props.disableSelectAll }
        }, ...hooks);

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
        if (tableInstance.onSort)
            tableInstance.onSort(sortBy[0]);
    }, [tableInstance.onSort, sortBy]);


    useEffect(() => {
        if (props.onSelectedChange) {
            const selectedRows = tableInstance.data.filter((d: Record<string, unknown>, ix: number) => {
                return Object.keys(selectedRowIds).map(Number).indexOf(ix) >= 0;
            });

            props.onSelectedChange(selectedRows, selectedRowIds);
        }
    }, [selectedFlatRows.length]);


    useImperativeHandle(ref, () => ({
        UnselectRow(rowIndex: number): void {
            tableInstance.rows[rowIndex].toggleRowSelected();
        }
    }));

    useEffect(() => {
        if (props.setPageIndex)
            props.setPageIndex(pageIndex);
    }, [pageIndex]);

    useEffect(() => {
        if (props.setPageSize)
            props.setPageSize(pageSize);
    }, [pageSize]);

    const cellClickHandler = (cell: Cell<Record<string, unknown>>) => (): void => {
        onClick && cell.column.id !== 'selection' && onClick(cell.row);
    };


    const RenderRow = memo(({ index, style }: {
        index: number,
        style: React.CSSProperties
    }) => {
        const row = page[index];
        if (!row) return null;
        prepareRow(row);
        return (
            <TableRow selected={!row.original.noCheckbox && row.isSelected} {...row.getRowProps({ style })}>
                {row.cells.map((cell) => (
                    <TableCell align={cell.column.align} {...cell.getCellProps()} key={cell.getCellProps().key} onClick={cellClickHandler(cell)}>
                        {
                            cell.render('Cell')
                        }
                    </TableCell>
                ))}
            </TableRow>
        );
    }, areEqual);

    const listRef = useRef<FixedSizeList>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const headerFiltersRef = useRef<HTMLDivElement>(null);

    const scrollHeader = (props: Event): void => {
        if (headerRef.current) {
            (headerRef.current).scrollLeft = (props.target as Element).scrollLeft;
        }

        if (headerFiltersRef.current) {
            (headerFiltersRef.current).scrollLeft = (props.target as Element).scrollLeft;
        }
    };

    const addScrollEventHandler = (): void => {
        // fix to make table-header scroll with list
        setTimeout(() => {
            if (listRef && listRef.current) {
                ((listRef.current) as any)._outerRef.onscroll = scrollHeader;
            }
        }, 50);

        // fix to set header width when no scroll-bar
        setTimeout(() => {
            if (listRef.current && listRef.current) {
                if (((listRef.current) as any)._outerRef.scrollHeight <= ((listRef.current) as any)._outerRef.clientHeight) {
                    if (headerRef && headerRef.current) {
                        headerRef.current.style.width = parseInt(headerRef.current.style.width.replace('px', '')) + 8 + 'px';
                    }

                    if (headerFiltersRef && headerFiltersRef.current) {
                        headerFiltersRef.current.style.width = parseInt(headerFiltersRef.current.style.width.replace('px', '')) + 8 + 'px';
                    }
                }
            }
        }, 50);
    };


    return (
        loading ? (
            <LoadingDiv><Spinner large /></LoadingDiv>
        ) : (
            <AutoSizer>
                {({ height, width }): JSX.Element => (
                    <div>
                        <div style={{ justifyContent: 'flex-end', width: width }}>
                            {props.toolbar ? props.toolbar : null}
                            {props.toolbarText && <Typography style={{ color: props.toolbarColor, width: 'max-content' }} variant='h6' >{props.toolbarText}</Typography>}
                        </div>
                        <Table {...getTableProps()}>
                            {
                                !props.noHeader &&
                                // render table header
                                headerGroups.map((headerGroup, i) => (
                                    <TableHeader {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key} ref={headerRef} style={{ width: width - 8, display: 'flex' }}>

                                        {headerGroup.headers.map((column) => {
                                            const style = {
                                                textAlign: column.align ? column.align : 'left '
                                            } as CSSProperties;

                                            return (
                                                <TableHeadCell align={column.align} {...column.getHeaderProps()} key={column.getHeaderProps().key} >
                                                    <div>
                                                        {column.canSort && column.defaultCanSort !== false ? (

                                                            <TableSortLabel
                                                                active={column.isSorted || column.id === props.orderBy?.id.toString()}
                                                                direction={column.id === props.orderBy?.id.toString() ? props.orderBy?.desc ? 'desc' : 'asc' : column.isSortedDesc ? 'desc' : 'asc'}
                                                                {...column.getSortByToggleProps()}
                                                            >
                                                                {column.render('Header')}
                                                            </TableSortLabel>
                                                        ) : (
                                                            <div style={style}>
                                                                {column.render('Header')}
                                                            </div>
                                                        )}
                                                        {column.canResize && <ResizeHandle column={column} />}
                                                    </div>
                                                </TableHeadCell>
                                            );
                                        })}

                                    </TableHeader>
                                ))
                            }
                            {
                                !props.noHeader &&
                                // show client side filtering if any cols specify it
                                hasFilters() && headerGroups.map((headerGroup, i) => (
                                    <TableHeader {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key} ref={headerFiltersRef} style={{ width: width - 8, display: 'flex' }}>
                                        {
                                            headerGroup.headers.filter((c) => c.filter).length > 0 &&
                                            headerGroup.headers.map((column) => {
                                                return (
                                                    <TableHeadFilterCell
                                                        {...column.getHeaderProps()}
                                                        key={column.getHeaderProps().key}
                                                    >
                                                        {column.filter && column.render('Filter')}
                                                    </TableHeadFilterCell>
                                                );
                                            })}
                                    </TableHeader>
                                ))
                            }

                            {/* render table */}
                            <div {...getTableBodyProps()}>
                                {props.data.length === 0 && (<div>No records to display</div>)}
                                <List
                                    height={height}
                                    itemCount={pageSize > props.data.length ? props.data.length : pageSize}
                                    itemSize={40}
                                    width={width}
                                    ref={listRef}
                                    onItemsRendered={addScrollEventHandler}
                                >
                                    {RenderRow}
                                </List>
                            </div>
                            <div style={{ width: width }}>
                                <TablePagination<Record<string, unknown>> instance={tableInstance} />
                            </div>
                        </Table>
                    </div>
                )}
            </AutoSizer>
        )
    );
}));

export default ProcosysTable;

