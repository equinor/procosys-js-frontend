import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
    padding: calc(var(--grid-unit) * 4) calc(var(--grid-unit) * 2)
        calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 2);
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
    ${(props): any =>
        props.isOverdue &&
        css`
            color: ${tokens.colors.interactive.danger__text.rgba};
        `}
`;

export const SelectFileButton = styled.div`
    padding: 10px;
    border: 1px solid ${tokens.colors.interactive.primary__resting.rgba};
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;
    :hover {
        background-color: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }
`;

export const SelectFileLabel = styled.div`
    margin-top: calc(var(--grid-unit) * 2 + 3px);
    margin-left: var(--grid-unit);
`;

export const AttachmentLink = styled.div`
    display: flex;
    color: ${tokens.colors.interactive.primary__resting.rgba};
    text-decoration: underline;
    cursor: pointer;
`;
