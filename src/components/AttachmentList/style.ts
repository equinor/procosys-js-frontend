import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const AddFile = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: calc(var(--grid-unit) * 2);
`;

export const AttachmentLink = styled.div`
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: underline;
    cursor: pointer;
    color: ${tokens.colors.interactive.primary__resting.rgba};
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

export const DragAndDropContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 500px;
    height: 200px;
    background-color: ${tokens.colors.ui.background__light.rgba};
    margin-bottom: calc(var(--grid-unit) * 2);
`;

export const DragAndDropTitle = styled.div`
    padding-top: calc(var(--grid-unit) * 4);
    padding-bottom: calc(var(--grid-unit) * 2);
`;

export const TableContainer = styled(Container)`
    height: 40vh;
`;
