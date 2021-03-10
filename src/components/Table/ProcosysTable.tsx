import {
    Cell,
    CellProps,
    ColumnInstance,
    HeaderGroup,
    HeaderProps,
    Hooks,
    Meta,
    TableOptions,
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
import { TableSortLabel, Theme, createStyles, makeStyles } from '@material-ui/core';

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
    useSortBy,
    usePagination,
    useResizeColumns,
    useRowSelect,
    selectionHook,
];

const Styles = styled.div`
        &.tableTable: {
            border-spacing: 0;
            border: '1px solid rgba(224; 224; 224; 1)';
            overflow-y: 'auto';
            max-height: '100%'
        }
        &.tableHeadRow: {
            outline: 0;
            overflow: 'hidden';
            vertical-align: 'middle';
            height: '40px';
            background-color: theme.palette.background.default;
            color: theme.palette.text.primary;
            font-weight: 500;
            line-height: '1.5rem';
            position: 'sticky';
            z-index: 10;
            top: 0;
            border-bottom: '1px solid rgba(224; 224; 224; 1)';
            '&:hover $resizeHandle': {
                opacity: 1;
            }
        }
        &.tableHeadCell: {
            padding: '16px 1px 16px 16px';
            font-size: '0.875rem';
            text-align: 'left';
            vertical-align: 'inherit';
            color: theme.palette.text.primary;
            font-weight: 500;
            line-height: '1.5rem';
            border-right: '1px solid rgba(224; 224; 224; 1)';
            '&:last-child': {
                border-right: 'none';
                margin-right: '2px';
                margin-left: '-2px'
            }
        }
        &.resizeHandle: {
            position: 'absolute';
            cursor: 'col-resize';
            z-index: 100;
            opacity: 0;
            border-left: '1px solid ';
            border-right: '1px solid';
            height: '50%';
            top: '25%';
            transition: 'all linear 100ms';
            right: -2;
            width: 3;
            '&.handleActive': {
                opacity: '1';
                border: 'none';
                background-color: theme.palette.primary.light;
                height: 'calc(100% - 4px)';
                top: '2px';
                right: -1;
                width: 1;
            }
        }
        tableRow: {
            color: 'inherit';
            outline: 0;
            vertical-align: 'middle';
            '&:hover': {
                background-color: 'rgba(0, 0, 0, 0.07)';
            }
            border-bottom: '1px solid rgba(224, 224, 224, 1)';
            '&:last-child': {
                border-bottom: 'none';
            }
            '&.rowSelected': {
                background-color: 'rgba(0, 0, 0, 0.04)';
                '&:hover': {
                    background-color: 'rgba(0, 0, 0, 0.07)';
                }
            }
        }
        tableCell: {
            padding: 16;
            font-size: '0.875rem';
            text-align: 'left';
            font-weight: 400;
            line-height: 1.43;
            vertical-align: 'inherit';
            color: theme.palette.text.primary;
            border-right: '1px solid rgba(224, 224, 224, 1)';
            '&:last-child': {
                border-right: 'none';
            }
            border-bottom: '1px solid rgba(224, 224, 224, 1)'
        }
        tableSortLabel: {
            '& svg': {
                width: 16;
                height: 16;
                margin-top: 0;
                margin-left: 2;
            }
        }
        headerIcon: {
            '& svg': {
                width: 16;
                height: 16;
                margin-top: 4;
                margin-right: 0;
            }
        }
        iconDirectionAsc: {
            transform: 'rotate(90deg)';
        }
        iconDirectionDesc: {
            transform: 'rotate(180deg)';
        }
        tableBody: {
            display: 'flex';
            flex: '1 1 auto';
            flex-direction: 'column';
        }
        tableLabel: {};
        cellIcon: {
            '& svg': {
                width: 16;
                height: 16;
                margin-top: 3;
            }
        }`;

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
    padding: 16px 1px 16px 16px;
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
    border-bottom: 1px solid rgba(224, 224, 224, 1);
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
    padding: 16;
    font-size: 0.875rem;
    text-align: left;
    font-weight: 400;
    line-height: 1.43;
    vertical-align: inherit;
    border-right: 1px solid rgba(224, 224, 224, 1);
    :last-child {
        border-right: none;
    }
    border-bottom: 1px solid rgba(224, 224, 224, 1);
`;


const ProcosysTable = forwardRef(((props: PropsWithChildren<TableProperties<Record<string, unknown>>>, ref?: React.Ref<void>) => {



    useImperativeHandle(ref, () => ({
        resetPageIndex(doReset = false): void {
            if (doReset)
                gotoPage(props.pageIndex);
        }
    }), [props.pageIndex]);

    const tableInstance = useTable<Record<string, unknown>>({ ...props, manualPagination: true, manualSortBy: true, initialState: { pageIndex: props.pageIndex, pageSize: props.pageSize } }, ...hooks);

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
        }, 500);

        // fix to set header width when no scroll-bar
        setTimeout(() => {
            if (listRef.current && listRef.current) {
                if (((listRef.current) as any)._outerRef.scrollHeight <= ((listRef.current) as any)._outerRef.clientHeight) {
                    if (headerRef && headerRef.current) {
                        ((headerRef.current) as any).style.width = (parseInt(((headerRef.current) as any).style.width.replace('px', '')) + 8) + 'px';
                    }
                }
            }
        }, 500);
    };

    return (
        <>
            {
                loading ? (
                    <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}><Spinner large /></div>
                ) : (
                    <Styles>
                        <div style={{ height: 'calc(90vh - 305px)' }}>
                            <AutoSizer>
                                {({ height, width }): JSX.Element => (
                                    <div>
                                        <Table {...getTableProps()}>
                                            {
                                                headerGroups.map((headerGroup, i) => (
                                                    <TableHeader {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key} ref={headerRef} style={{ width: width - 8, display:'flex' }}>

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
                                                                </TableHeadCell>
                                                            );
                                                        })}

                                                    </TableHeader>
                                                ))
                                            }

                                            <div {...getTableBodyProps()} className={'tableBody'}>
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
                    </Styles>
                )
            }
        </>
    );
}));

export default ProcosysTable;

