import { CellValue, IdType } from 'react-table';
import { ColumnFilterProps, DefaultFilter, SelectFilter } from './types';
import { MenuItem, Select } from '@material-ui/core';

import { ColumnFilter } from './style';
import FilterListIcon from '@material-ui/icons/FilterList';
import React from 'react';
import { TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';

const TableFilterField = styled(TextField)`
    width: calc(100% - 5px);
    > div > div {
        top: 6px;
        right: 10px;
    }
`;

const StyledSelect = styled(Select)`
    height: 36px;
    background-color: #f7f7f7;
    width: calc(100% - 5px);
    padding: 4px;
    > div {
        :focus {
            background-color: #f7f7f7;
        }
    }
`;

export const DefaultColumnFilter = ( { column }: ColumnFilterProps<DefaultFilter>) : JSX.Element => {
    const { setFilter, filterPlaceholder } = column;
    return (
        <ColumnFilter>
            <TableFilterField
                placeholder={filterPlaceholder}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setFilter(e.target.value || undefined);
                }}
                inputIcon={<FilterListIcon />}
                type='search' />
        </ColumnFilter>
    );
};


// Need to use material-ui Select until further -> EDS-SingleSelect cannot handle overflow:hidden in row.
export const SelectColumnFilter = ({ column } : ColumnFilterProps<SelectFilter>): JSX.Element => {
    const { preFilteredRows, id, filterValue, setFilter } = column;
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
