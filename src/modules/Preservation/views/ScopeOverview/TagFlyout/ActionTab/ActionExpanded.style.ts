import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';

export const Container = styled.div<{ isClosed: boolean }>`
    ${(props): any =>
        !props.isClosed &&
        css`
            border-bottom: solid 1px
                ${tokens.colors.interactive.primary__resting.rgba};
        `};
    ${(props): any =>
        props.isClosed &&
        css`
            border-bottom: solid 1px ${tokens.colors.ui.background__medium.rgba};
        `};

    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 2) 0px
        calc(var(--grid-unit) * 2);
`;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: calc(var(--grid-unit) * 2);
`;

export const GridRow = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-column-gap: calc(var(--grid-unit) * 3);
    float: left;
`;

export const IconContainer = styled.div`
    display: flex;
`;

export const StyledButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: var(--grid-unit);

    :hover {
        background: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;
