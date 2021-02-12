import styled from 'styled-components';
import { Popover } from '@equinor/eds-core-react';
const { PopoverContent } = Popover;

export const CustomPopoverCard = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PersonItem = styled.div`
    margin-right: calc(var(--grid-unit) * 4);
`;

export const PersonItemRight = styled.div`
    margin-left: auto;
`;

export const PersonRow = styled.div`
    display: flex;
    align-items: center;
`;

export const FloatingPopover = styled(Popover)`
    margin-left: auto;
`;