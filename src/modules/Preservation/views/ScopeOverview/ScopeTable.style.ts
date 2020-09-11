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

export const TagLink = styled.span<{ isOverdue: boolean; isVoided: boolean }>`
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${(props): string => props.isVoided ?
        '' :
        props.isOverdue
            ? tokens.colors.interactive.danger__text.rgba
            : tokens.colors.interactive.primary__resting.rgba};
    span { color: ${(props): string => props.isVoided ?
        '' :
        props.isOverdue
            ? tokens.colors.interactive.danger__text.rgba
            : tokens.colors.interactive.primary__resting.rgba};
    }
    text-decoration: underline;
    cursor: pointer;
`;

export const Container = styled.div`
    input + svg {
        width: 24px;
        height: 24px;
        
    }

    tbody, thead {
        .MuiButtonBase-root {
            :hover {
                background-color:  ${tokens.colors.interactive.primary__hover_alt.rgba};
            }
            > .MuiIconButton-label > svg {
                fill: ${tokens.colors.interactive.primary__resting.rgba};
            }
        }

        .MuiCheckbox-colorSecondary.Mui-checked:hover {
            background-color:  ${tokens.colors.interactive.primary__hover_alt.rgba};
        }

        .MuiTouchRipple-root {
            display: none;
        }
    }

    .controlOverflow {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: inherit;
    }
`;

export const SingleIconContainer = styled.div`
    margin-bottom: calc(var(--grid-unit) * -1); /* centers the icon vertically and prevents the row height from expanding */
`;
