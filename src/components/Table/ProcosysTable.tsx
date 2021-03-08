import React, { useEffect, PropsWithChildren, CSSProperties, forwardRef, useImperativeHandle, memo, useRef } from 'react';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { FixedSizeList as List, areEqual } from 'react-window';
import cx from 'classnames';
import {
    Cell,
    CellProps,
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
    useTable,
    ColumnInstance
} from 'react-table';
import { TablePagination } from './TablePagination';
import { makeStyles, createStyles, Theme, TableSortLabel } from '@material-ui/core';
import Spinner from '../Spinner';
import { HeaderCheckbox, RowCheckbox } from './TableStyles';
import { ResizeHandle } from './ResizeHandle';
import AutoSizer from 'react-virtualized-auto-sizer';

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
    fetchData: (args: any) => void;
    columns: ColumnInstance<any>[];
    pageCount: number;
    loading: boolean;
    data: any[];
    maxRowCount: number;
    pageSize: number;
    pageIndex: number;
    onSelectedChange: (args: any[]) => void;
    onSort: (args: string) => void;
}

const selectionHook = (hooks: Hooks<any>): void => {
    hooks.allColumns.push((columns) => [
        {
            id: 'selection',
            disableResizing: true,
            disableGroupBy: true,
            minWidth: 45,
            width: 45,
            maxWidth: 45,
            Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>): JSX.Element => (
                <HeaderCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }: CellProps<any>): JSX.Element => <RowCheckbox {...row.getToggleRowSelectedProps()} />,
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


export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tableTable: {
            borderSpacing: 0,
            border: '1px solid rgba(224, 224, 224, 1)',
            overflowY: 'auto',
            maxHeight: '100%'
        },
        tableHeadRow: {
            outline: 0,
            overflow: 'hidden',
            verticalAlign: 'middle',
            height: '40px',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            fontWeight: 500,
            lineHeight: '1.5rem',
            position: 'sticky',
            zIndex: 10,
            top: 0,
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            '&:hover $resizeHandle': {
                opacity: 1,
            },
        },
        tableHeadCell: {
            padding: '16px 1px 16px 16px',
            fontSize: '0.875rem',
            textAlign: 'left',
            verticalAlign: 'inherit',
            color: theme.palette.text.primary,
            fontWeight: 500,
            lineHeight: '1.5rem',
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            '&:last-child': {
                borderRight: 'none',
                marginRight: '2px',
                marginLeft: '-2px'
            },
        },
        resizeHandle: {
            position: 'absolute',
            cursor: 'col-resize',
            zIndex: 100,
            opacity: 0,
            borderLeft: `1px solid ${theme.palette.primary.light}`,
            borderRight: `1px solid ${theme.palette.primary.light}`,
            height: '50%',
            top: '25%',
            transition: 'all linear 100ms',
            right: -2,
            width: 3,
            '&.handleActive': {
                opacity: '1',
                border: 'none',
                backgroundColor: theme.palette.primary.light,
                height: 'calc(100% - 4px)',
                top: '2px',
                right: -1,
                width: 1,
            },
        },
        tableRow: {
            color: 'inherit',
            outline: 0,
            verticalAlign: 'middle',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.07)',
            },
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            '&:last-child': {
                borderBottom: 'none',
            },
            '&.rowSelected': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.07)',
                },
            },
        },
        tableCell: {
            padding: 16,
            fontSize: '0.875rem',
            textAlign: 'left',
            fontWeight: 400,
            lineHeight: 1.43,
            verticalAlign: 'inherit',
            color: theme.palette.text.primary,
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            '&:last-child': {
                borderRight: 'none',
            },
            borderBottom: '1px solid rgba(224, 224, 224, 1)'
        },
        tableSortLabel: {
            '& svg': {
                width: 16,
                height: 16,
                marginTop: 0,
                marginLeft: 2,
            },
        },
        headerIcon: {
            '& svg': {
                width: 16,
                height: 16,
                marginTop: 4,
                marginRight: 0,
            },
        },
        iconDirectionAsc: {
            transform: 'rotate(90deg)',
        },
        iconDirectionDesc: {
            transform: 'rotate(180deg)',
        },
        tableBody: {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
        },
        tableLabel: {},
        cellIcon: {
            '& svg': {
                width: 16,
                height: 16,
                marginTop: 3,
            },
        },
    })
);

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

const headerProps = <T extends Record<string, unknown>>(props: any, { column }: Meta<T, { column: HeaderGroup<T> }>): any =>
    getStyles(props, column && column.disableResizing, column && column.align);

const cellProps = <T extends Record<string, unknown>>(props: any, { cell }: Meta<T, { cell: Cell<T> }>): any =>
    getStyles(props, cell.column && cell.column.disableResizing, cell.column && cell.column.align);


const ProcosysTable = forwardRef((<T extends Record<string, unknown>>(props: PropsWithChildren<TableProperties<T>>, ref?: any) => {
    const classes = useStyles();

    useImperativeHandle(ref, () => ({
        resetPageIndex(doReset = false): void {
            if (doReset)
                gotoPage(props.pageIndex);
        }
    }), [props.pageIndex]);

    const tableInstance = useTable<T>({ ...props, manualPagination: true, manualSortBy: true, initialState: { pageIndex: props.pageIndex, pageSize: props.pageSize } }, ...hooks);

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
        const selectedRows = tableInstance.data.filter((d: any, ix: number) => { return Object.keys(selectedRowIds).map(Number).indexOf(ix) >= 0; });
        props.onSelectedChange(selectedRows);

    }, [selectedRowIds, tableInstance]);

    const cellClickHandler = (cell: Cell<T>) => (): void => {
        onClick && cell.column.id !== '_selector' && onClick(cell.row);
    };

    const RenderRow = memo<any>(({ index, style }: any) => {
        const row = page[index];
        if (!row) return null;
        prepareRow(row);
        return (
            <div {...row.getRowProps({ style })} className={cx(classes.tableRow, { rowSelected: row.isSelected })}>
                {row.cells.map((cell) => (
                    //eslint-disable-next-line
                    <div {...cell.getCellProps(cellProps)} onClick={cellClickHandler(cell)} className={classes.tableCell}>
                        {
                            cell.render('Cell')
                        }
                    </div>
                ))}
            </div>
        );
    }, areEqual);

    const listRef = useRef(null);
    const headerRef = useRef(null);

    const scrollHeader = (props: any): void => {
        if (headerRef.current) {
            (headerRef.current as any).scrollLeft = props.target.scrollLeft;
        }
    };

    const addScrollEventHandler = (props: any): void => {
        // fix to make table-header scroll with list
        setTimeout(() => {
            if (listRef.current && listRef.current) {
                ((listRef.current) as any)._outerRef.onscroll = scrollHeader;
            }
        }, 50);

        // fix to set header with when no scroll-bar
        setTimeout(() => {
            if (listRef.current && listRef.current) {
                if (((listRef.current) as any)._outerRef.scrollHeight <= ((listRef.current) as any)._outerRef.clientHeight) {
                    if (headerRef && headerRef.current) {
                        const headref = (headerRef.current) as any;
                        headref.style.width = (parseInt(headref.style.width.replace('px', '')) + 8) + 'px';
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
                                    <div {...getTableProps()}>
                                        {
                                            headerGroups.map((headerGroup) => (
                                                //eslint-disable-next-line
                                                    <div {...headerGroup.getHeaderGroupProps()} ref={headerRef} style={{ width: width - 8, display: 'flex' }} className={classes.tableHeadRow}>
                                                    {headerGroup.headers.map((column) => {
                                                        const style = {
                                                            textAlign: column.align ? column.align : 'left '
                                                        } as CSSProperties;

                                                        return (
                                                        //eslint-disable-next-line
                                                                <div {...column.getHeaderProps(headerProps)} className={classes.tableHeadCell}>
                                                                {column.canSort && column.defaultCanSort !== false ? (
                                                                    <TableSortLabel
                                                                        active={column.isSorted}
                                                                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                                                                        {...column.getSortByToggleProps()}
                                                                        className={classes.tableSortLabel}
                                                                        style={style}
                                                                    >
                                                                        {column.render('Header')}
                                                                    </TableSortLabel>
                                                                ) : (
                                                                    <div style={style} className={classes.tableLabel}>
                                                                        {column.render('Header')}
                                                                    </div>
                                                                )}
                                                                {column.canResize && <ResizeHandle column={column} />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))
                                        }

                                        <div {...getTableBodyProps()} className={classes.tableBody}>
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
                                            <TablePagination<T> instance={tableInstance} />
                                        </div>
                                    </div>
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

