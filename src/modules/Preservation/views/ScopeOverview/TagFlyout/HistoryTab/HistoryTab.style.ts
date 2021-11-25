import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    padding: calc(var(--grid-unit) * 2);
    height: calc(100vh - 250px);
`;

export const DetailsContainer = styled.div`
    cursor: pointer;
`;

export const DueContainer = styled.div<{ isOverdue: boolean }>`
    ${(props): any =>
        props.isOverdue &&
        css`
            color: ${tokens.colors.interactive.danger__text.rgba};
        `}
`;

export const OverflowColumn = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
`;
