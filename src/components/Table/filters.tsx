import { CellValue, IdType, UseTableRowProps } from 'react-table';
import { Checkbox, InputAdornment, Select } from '@material-ui/core';

import { ColumnFilter } from './style';
import FilterListIcon from '@material-ui/icons/FilterList';
import React from 'react';
import { TextField } from '@material-ui/core';

export const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }: { column: { filterValue: string, preFilteredRows: any[], setFilter: (a: string | undefined) => void } }): JSX.Element => {
    const count = preFilteredRows.length;

    return (
        <ColumnFilter>
            <TextField
                style={{ width: 'calc(100% - 14px)' }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setFilter(e.target.value || undefined);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <FilterListIcon />
                        </InputAdornment>
                    )
                }}
                type='search' />
        </ColumnFilter>
    );
};


export const CheckBoxColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter, id } }: { column: { filterValue: string, preFilteredRows: UseTableRowProps<Record<IdType<any>, CellValue>>[], setFilter: (a: string | undefined) => void, id: number } }): JSX.Element => {
    
    return (
        <Checkbox
            id="filterCheck"
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                if (e.target.checked)
                    setFilter('true');
                else
                    setFilter(undefined);
            }}
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
    );
};

export const SelectColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter, id } }: { column: { filterValue: string, preFilteredRows: UseTableRowProps<Record<IdType<any>, CellValue>>[], setFilter: (a: string | undefined) => void, id: number } }): JSX.Element => {
    const options = React.useMemo(() => {
        const options = new Set<string>();
        preFilteredRows.forEach((row: Record<IdType<any>, CellValue>) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    return (
        <Select
            id="custom-select"
            type="select"
            value={filterValue}
            onChange={(e: React.ChangeEvent<{ value: unknown }>): void => {
                setFilter(e.target.value as string || undefined);
            }}
        >
            <option value="">All</option>
            {options.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </Select>
    );
};