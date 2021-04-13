import { CellValue, IdType, UseTableRowProps } from 'react-table';
import { MenuItem, Select } from '@material-ui/core';
import { ColumnFilter } from './style';
import FilterListIcon from '@material-ui/icons/FilterList';
import React from 'react';
import styled from 'styled-components';
import { TextField } from '@equinor/eds-core-react';

const TableFilterField = styled(TextField)`
    width: calc(100% - 14px);
`;

const StyledSelect = styled(Select)`
    height: 36px;
`;

export const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }: { column: { filterValue: string, preFilteredRows: any[], setFilter: (a: string | undefined) => void } }): JSX.Element => {
    return (
        <ColumnFilter>
            <TableFilterField
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setFilter(e.target.value || undefined);
                }}
                inputIcon={<FilterListIcon />}
                type='search' />
        </ColumnFilter>
    );
};


// Need to use material-ui Select until further -> EDS-SingleSelect cannot handle overflow:hidden in row.
export const SelectColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter, id } }: { column: { filterValue: string, preFilteredRows: UseTableRowProps<Record<IdType<any>, CellValue>>[], setFilter: (a: string | undefined) => void, id: number } }): JSX.Element => {
    const options = React.useMemo(() => {
        const options = new Set<string>();
        preFilteredRows.forEach((row: Record<IdType<any>, CellValue>) => {
            if (typeof (row.values[id]) === 'object') {
                if (row.values[id][id])
                    options.add(row.values[id][id]);
            }
            else if (row.values[id])
                options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    const selectValue = filterValue || '_all_';

    const handleChange = (e: React.ChangeEvent<{ value: unknown }>): void => {
        setFilter((e.target.value as string) === '_all_' ? undefined : (e.target.value as string));
    };

    return (
        <StyledSelect
            id="custom-select"
            value={selectValue}
            onChange={handleChange}
        >
            <MenuItem key="_all_" value="_all_">All</MenuItem>
            {options.map((option, i) => (
                <MenuItem key={i} value={option}>
                    {option}
                </MenuItem>
            ))}
        </StyledSelect>
    );
};