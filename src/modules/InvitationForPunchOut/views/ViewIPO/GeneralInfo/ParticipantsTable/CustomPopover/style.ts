import styled from 'styled-components';
import { Popover } from '@equinor/eds-core-react';
const { PopoverContent } = Popover;

export const CustomPopoverCard = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PersonItem = styled.div`
    flex: 1;
`;

export const PersonItemRight = styled.div`
    flex: 1;
    margin-left: auto;
`;

export const PersonRow = styled.div`
    display: flex;
    align-items: center;
`;

export const FloatingPopover = styled(Popover)`
    float: right;
    margin-left: auto;
`;