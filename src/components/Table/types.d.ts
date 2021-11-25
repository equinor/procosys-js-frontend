import { CellValue, IdType, UseTableRowProps } from 'react-table';

type DefaultFilter = {
    filterValue: string;
    setFilter: (a: string | undefined) => void;
    preFilteredRows: any[];
    filterPlaceholder: string;
};

type SelectFilter = {
    filterValue: string;
    setFilter: (a: string | undefined) => void;
    preFilteredRows: UseTableRowProps<Record<IdType<any>, CellValue>>[];
    id: number;
};

interface ColumnFilterProps<T> {
    column: T;
}
