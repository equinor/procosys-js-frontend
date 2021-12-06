import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TagDetailsContainer = styled.div`
    display: flex;
    background: ${tokens.colors.ui.background__light.rgba};
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
`;

export const TextFieldContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: calc(var(--grid-unit) * 2);
`;

export const TextFieldLabelReadOnly = styled.div`
    padding-top: 1px;
    padding-bottom: 1px;
    font-size: 12px;
`;

export const TextFieldReadOnly = styled.div`
    padding: 11px 8px 11px 8px;
    background: #f7f7f7;
    min-height: 16px;
    overflow-wrap: anywhere;
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

export const Details = styled.div`
    display: flex;
    flex-direction: column;
    padding: calc(var(--grid-unit) * 2);
`;

export const TagDetailsInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: calc(var(--grid-unit) * 2);
    padding-bottom: 0px;
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
`;

export const GridFirstRow = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    grid-column-gap: calc(var(--grid-unit) * 3);
    float: left;
`;

export const GridSecondRow = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-template-rows: auto auto;
    grid-column-gap: calc(var(--grid-unit) * 3);
    float: left;
`;

export const IconContainer = styled.div`
    display: flex;
    margin-right: var(--grid-unit);
    padding-top: calc(var(--grid-unit) * 2);
`;
