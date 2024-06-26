import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    margin-top: var(--margin-module--top);
    min-height: 200px;
    flex-grow: 1;
    margin-bottom: 52px;

    tbody,
    thead {
        .MuiButtonBase-root {
            :hover {
                background-color: ${tokens.colors.interactive.primary__hover_alt
                    .rgba};
            }
            > .MuiIconButton-label > svg {
                fill: ${tokens.colors.interactive.primary__resting.rgba};
            }
        }

        .MuiCheckbox-colorSecondary.Mui-checked:hover {
            background-color: ${tokens.colors.interactive.primary__hover_alt
                .rgba};
        }

        .MuiTouchRipple-root {
            display: none;
        }
    }

    .controlOverflow {
        overflow: hidden;
        white-space: pre-wrap;
        text-overflow: ellipsis;
        color: inherit;
    }
    .controlOverflow > p {
        max-height: 64px;
        overflow-y: auto;
    }
`;

export const CustomLink = styled(Link)`
    color: ${tokens.colors.interactive.primary__resting.rgba};
`;
