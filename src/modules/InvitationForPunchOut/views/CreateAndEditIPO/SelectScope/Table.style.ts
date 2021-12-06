import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div<{
    disableSelectAll?: boolean;
    mcColumn?: boolean;
}>`
    input + svg {
        width: 24px;
        height: 24px;
    }

    thead > tr > th:first-child > span {
        ${(props): any =>
            props.disableSelectAll &&
            css`
                pointer-events: none !important;
                .MuiIconButton-label > svg {
                    fill: ${tokens.colors.interactive.disabled__border.rgba};
                }
            `};
    }
    ${(props): any =>
        props.mcColumn &&
        css`
            thead > tr > th:last-child {
                text-align: center;
            }
        `};

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
        .MuiButtonBase-root.Mui-disabled > .MuiIconButton-label > svg {
            fill: ${tokens.colors.interactive.disabled__border.rgba};
        }

        .MuiCheckbox-colorSecondary.Mui-checked:hover {
            background-color: ${tokens.colors.interactive.primary__hover_alt
                .rgba};
        }

        .MuiTouchRipple-root {
            display: none;
        }

        td > svg > path {
            color: #dadada;
        }
    }

    .controlOverflow {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .tableCell {
        display: flex;
        align-items: center;
    }

    .goToMcCol {
        position: relative;
        /* bottom: 9px; */
    }
`;

export const Search = styled.div`
    display: flex;
    flex: 1;
    padding-bottom: calc(var(--grid-unit) * 3);
    input {
        max-width: 500px;
    }
`;

export const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: calc(var(--grid-unit) * 3) 0;
    align-items: center;
`;

export const MCHeader = styled.div`
    padding-left: 12px;
`;

export const CommPkgTableContainer = styled.div`
    height: 48vh;
`;

export const McPkgTableContainer = styled.div`
    height: 48vh;
`;
