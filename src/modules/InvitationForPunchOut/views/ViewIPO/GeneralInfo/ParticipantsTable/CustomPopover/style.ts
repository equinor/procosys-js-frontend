import styled from 'styled-components';
import { Popover } from '@equinor/eds-core-react';
const { PopoverContent } = Popover;

export const CustomPopoverCard = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PersonItem = styled.div`
    margin: 0;
`;

export const PersonItemRight = styled.div`
    margin: 0;
    color: red;
`;

export const PersonRow = styled.div`
    position: relative;
`;

export const FloatingPopover = styled(Popover)`
    margin-left: auto;
`;