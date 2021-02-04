import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    margin-top: var(--margin-module--top);
        .MuiTableCell-root {
            border-bottom: none;
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
