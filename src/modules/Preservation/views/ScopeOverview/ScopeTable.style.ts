import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Toolbar = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
    margin-bottom: var(--grid-unit);
`;

export const TagStatusLabel = styled.span`
    margin-left: auto;
    border-radius: calc(var(--grid-unit) * 2);
    padding: calc(var(--grid-unit) / 2) var(--grid-unit);    
    font-size: calc(var(--grid-unit) * 1.5);
    background: ${tokens.colors.interactive.primary__selected_highlight.rgba};
    color: ${tokens.colors.interactive.primary__resting.rgba};  
`;

export const TagLink = styled.span<{ isOverdue: boolean }>`
    color: ${(props): string => props.isOverdue
        ? tokens.colors.interactive.danger__text.rgba
        : tokens.colors.interactive.primary__resting.rgba};

    text-decoration: underline;
    cursor: pointer;
`;
