import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
    padding: 
        calc(var(--grid-unit) * 4) 
        calc(var(--grid-unit) * 2) 
        calc(var(--grid-unit) * 2) 
        calc(var(--grid-unit) * 2);
`;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: calc(var(--grid-unit) * 2);
`;

export const Field = styled.div`
    margin-bottom: var(--grid-unit);
`;

export const NextInfo = styled.span<{ isOverdue: boolean }>`
    ${(props): any => props.isOverdue && css`
        color: ${tokens.colors.interactive.danger__text.rgba};
    `}
`;
