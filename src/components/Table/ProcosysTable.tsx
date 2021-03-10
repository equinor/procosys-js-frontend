import {
    Cell,
    CellProps,
    ColumnInstance,
    HeaderGroup,
    HeaderProps,
    Hooks,
    Meta,
    TableOptions,
    useFilters,
    useFlexLayout,
    usePagination,
    useResizeColumns,
    useRowSelect,
    useSortBy,
    useTable
} from 'react-table';
import { HeaderCheckbox, RowCheckbox } from './TableStyles';
import { FixedSizeList as List, areEqual } from 'react-window';
import React, { CSSProperties, PropsWithChildren, forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';
import { TableSortLabel } from '@material-ui/core';

import AutoSizer from 'react-virtualized-auto-sizer';
import { ResizeHandle } from './ResizeHandle';
import Spinner from '../Spinner';
import { TablePagination } from './TablePagination';
import cx from 'classnames';
import styled from 'styled-components';

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
    fetchData: (args: any) => void;
    columns: ColumnInstance<T>[];
    pageCount: number;
    loading: boolean;
    data: T[];
    maxRowCount: number;
    pageSize: number;
    pageIndex: number;
    onSelectedChange: (args: any[]) => void;
    onSort: (args: string) => void;
}

const selectionHook = (hooks: Hooks<Record<string, unknown>>): void => {
    hooks.allColumns.push((columns) => [
        {
            id: 'selection',
            disableResizing: true,
            disableGroupBy: true,
            minWidth: 45,
            width: 45,
            maxWidth: 45,
            Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<Record<string, unknown>>): JSX.Element => (
                <HeaderCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }: CellProps<Record<string, unknown>>): JSX.Element => <RowCheckbox {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
    ]);
};

const hooks = [
    useFlexLayout,
    useFilters,
    useSortBy,
    usePagination,
    useResizeColumns,
    useRowSelect,
    selectionHook,
];


const getStyles = (props: any, disableResizing = false, align = 'left'): any => [
    props,
    {
        style: {
            justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start',
            display: 'flex',
        },
    },
];

const headerProps = <T extends Record<string, unknown>>(props: T, { column }: Meta<T, { column: HeaderGroup<T> }>): T =>
    getStyles(props, column && column.disableResizing, column && column.align);

const cellProps = <T extends Record<string, unknown>>(props: T, { cell }: Meta<T, { cell: Cell<T> }>): T =>
    getStyles(props, cell.column && cell.column.disableResizing, cell.column && cell.column.align);

const TableHeader = styled.div`
    outline: 0;
    overflow: hidden;
    vertical-align: middle;
    height: 40px;
    background-color: rgb(247, 247, 247);
    font-weight: 500;
    line-height: 1.5rem;
    position: sticky;
    z-index: 10;
    top: 0;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    &:hover $resizeHandle: {
        opacity: 1;
    }
`;

const Table = styled.div`
    border-spacing: 0;
    overflow-y: auto;
    max-height: 100%;
    width: 100vw;
`;

const TableHeadCell = styled.div`
    padding: 8px 1px 1px 16px;
    font-size: 0.875rem;
    text-align: left;
    vertical-align: inherit;
    font-weight: 500;
    line-height: 1.5rem;
    border-right: 1px solid rgba(224, 224, 224, 1);
    :last-child {
        border-right: none;
        margin-right: 2px;
        margin-left: -2px
    }
`;

const TableRow = styled.div`
    color: inherit;
    outline: 0;
    vertical-align: middle;
    &:hover {
        background-color: rgba(0, 0, 0, 0.07);
    }
    :last-child {
        border-bottom: none;
    }
    &.rowSelected {
        background-color: rgba(0, 0, 0, 0.04);
        &:hover {
            background-color: rgba(0, 0, 0, 0.07);
        }
    }
`;


const TableCell = styled.div`
    padding: 12px 16px 16px 16px;
    font-size: inherit;
    text-align: left;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    font-weight: 400;
    line-height: 1.43;
    vertical-align: inherit;
    :last-child {
        border-right: none;
    }
`;

const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }: { column: { filterValue: string, preFilteredRows: unknown[], setFilter: (a: string | undefined) => void } }) => {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

function customFilter(rows: any[], id: number, filterValue: string) {
    console.log('rows', rows)
    return rows.filter((row: any) => {
        const rowValue = row.values[id];
        return rowValue >= filterValue
    })
}



const ProcosysTable = forwardRef(((props: PropsWithChildren<TableProperties<Record<string, unknown>>>, ref?: React.Ref<void>) => {
    useImperativeHandle(ref, () => ({
        resetPageIndex(doReset = false): void {
            if (doReset)
                gotoPage(props.pageIndex);
        }
    }), [props.pageIndex]);

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const filterTypes = React.useMemo(
        () => ({
            // Or, override the default text filter to use
            // "startWith"
            text: (rows: any, id: number, filterValue: string) => {
                return rows.filter((row: any) => {
                    const rowValue = row.values[id]
                    console.log('rowValue', rowValue)
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    const tableInstance = useTable<Record<string, unknown>>({ ...props, filterTypes, manualPagination: true, defaultColumn, manualSortBy: true, initialState: { pageIndex: props.pageIndex, pageSize: props.pageSize } }, ...hooks);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        onClick,
        loading,
        gotoPage,
        state: { pageIndex, pageSize, selectedRowIds, sortBy },
    } = tableInstance;

    useEffect(() => {
        tableInstance.onSort(sortBy);
    }, [tableInstance.onSort, sortBy]);

    useEffect(() => {
        props.fetchData({ pageIndex, pageSize, orderBy: 'due', orderDirection: 'asc' });
        props.setPageSize(pageSize);
    }, [pageIndex, pageSize]);

    useEffect(() => {
        const selectedRows = tableInstance.data.filter((d: Record<string, unknown>, ix: number) => { return Object.keys(selectedRowIds).map(Number).indexOf(ix) >= 0; });
        props.onSelectedChange(selectedRows);

    }, [selectedRowIds, tableInstance]);

    const cellClickHandler = (cell: Cell<Record<string, unknown>>) => (): void => {
        onClick && cell.column.id !== '_selector' && onClick(cell.row);
    };

    const RenderRow = memo(({ index, style }: {
        index: number,
        style: React.CSSProperties
    }) => {
        const row = page[index];
        if (!row) return null;
        prepareRow(row);
        return (
            <TableRow {...row.getRowProps({ style })} className={cx('tableRow', { rowSelected: row.isSelected })}>

                {row.cells.map((cell) => (
                    <TableCell {...cell.getCellProps(cellProps)} key={cell.getCellProps(cellProps).key} onClick={cellClickHandler(cell)}>
                        {
                            cell.render('Cell')
                        }
                    </TableCell>
                ))}

            </TableRow>
        );
    }, areEqual);

    const listRef = useRef(null);
    const headerRef = useRef(null);

    const scrollHeader = (props: Event): void => {
        if (headerRef.current) {
            (headerRef.current as unknown as Element).scrollLeft = (props.target as Element).scrollLeft;
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
                        ((headerRef.current) as any).style.width = (parseInt(((headerRef.current) as any).style.width.replace('px', '')) + 8) + 'px';
                    }
                }
            }
        }, 50);
    };

    return (
        <>
            {
                loading ? (
                    <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}><Spinner large /></div>
                ) : (
                    <div style={{ height: 'calc(90vh - 305px)' }}>
                        <AutoSizer>
                            {({ height, width }): JSX.Element => (
                                <div>
                                    <Table {...getTableProps()}>
                                        {
                                            headerGroups.map((headerGroup, i) => (
                                                <TableHeader {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key} ref={headerRef} style={{ width: width - 8, display: 'flex' }}>

                                                    {headerGroup.headers.map((column) => {
                                                        const style = {
                                                            textAlign: column.align ? column.align : 'left '
                                                        } as CSSProperties;

                                                        return (
                                                            <TableHeadCell {...column.getHeaderProps(headerProps)} key={column.getHeaderProps(headerProps).key} >
                                                                {column.canSort && column.defaultCanSort !== false ? (
                                                                    <TableSortLabel
                                                                        active={column.isSorted}
                                                                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                                                                        {...column.getSortByToggleProps()}
                                                                        className={'tableSortLabel'}
                                                                        style={style}
                                                                    >
                                                                        {column.render('Header')}
                                                                    </TableSortLabel>
                                                                ) : (
                                                                    <div style={style} className={'tableLabel'}>
                                                                        {column.render('Header')}
                                                                    </div>
                                                                )}
                                                                {column.canResize && <ResizeHandle column={column} />}
                                                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                                                            </TableHeadCell>
                                                        );
                                                    })}

                                                </TableHeader>
                                            ))
                                        }

                                        <div {...getTableBodyProps()}>
                                            <List
                                                height={height}
                                                itemCount={tableInstance.data.length}
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
                    </div>
                )
            }
        </>
    );
}));

export default ProcosysTable;

