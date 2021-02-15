import styled from 'styled-components';
import { Popover } from '@equinor/eds-core-react';
const { PopoverContent } = Popover;

export const CustomTable = styled.div`
    display:table;
    width: 100%;
`;

export const TableRow = styled.div`
    display: table-row;
    :first-child{
        padding-right: calc(var(--grid-unit) * 4);
    }
`;

export const TableCell = styled.div`
    display: table-cell;
`;

export const TableCellRight = styled(TableCell)`
    padding-left: calc(var(--grid-unit) * 4);
`;

export const FloatingPopover = styled(Popover)`
    margin-left: auto;
`;