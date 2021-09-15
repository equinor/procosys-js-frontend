import React, { PropsWithChildren, ReactElement, useCallback } from 'react';

import { TableInstance } from 'react-table';
import { TablePagination as _MuiTablePagination } from '@material-ui/core';

const rowsPerPageOptions = [10, 25, 50, 100, 500, 1000];

type PaginationType = typeof _MuiTablePagination
const MuiTablePagination: PaginationType = React.memo(_MuiTablePagination) as PaginationType;

export function TablePagination<T extends Record<string, unknown>>({
    instance
}: PropsWithChildren<{ instance: TableInstance<T> }>): ReactElement | null {
    const {
        state: { pageIndex, pageSize, rowCount = instance.columns.filter(x => x.filterValue).length > 0 ? instance.filteredRows.length : instance.maxRowCount },
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        setPageIndex
    } = instance;

    const handleChangePage = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
            if (newPage === pageIndex + 1) {
                nextPage();
            } else if (newPage === pageIndex - 1) {
                previousPage();
            } else {
                gotoPage(newPage);
            }

            if (setPageIndex)
                setPageIndex(newPage);
        },
        [gotoPage, nextPage, pageIndex, previousPage]
    );

    const onChangeRowsPerPage = useCallback(
        (e) => {
            setPageSize(Number(e.target.value));
        },
        [setPageSize]
    );

    return rowCount ? (
        <MuiTablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component='div'
            count={rowCount}
            rowsPerPage={pageSize}
            page={pageIndex}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
        />
    ) : null;
}
