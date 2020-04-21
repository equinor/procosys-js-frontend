import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button, TextField } from '@equinor/eds-core-react';

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

export const StyledTextField = styled(TextField)`
    margin-bottom: calc(var(--grid-unit) * 2);
    width: 30%;
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
`;
