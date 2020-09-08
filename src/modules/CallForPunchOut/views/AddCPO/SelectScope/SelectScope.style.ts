import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
`;

export const SelectComponent = styled.div<{disableSelectAll: boolean}>`
    display: flex;
    flex-direction: column;
    width: 70%;
    input + svg {
        width: 24px;
        height: 24px;
    }

    thead > tr > th:first-child > span {
        ${(props): any => props.disableSelectAll && css`
            pointer-events: none !important;
            .MuiIconButton-label > svg {
                fill: ${tokens.colors.interactive.disabled__border.rgba};
            }
        `}; 
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
        .MuiButtonBase-root.Mui-disabled > .MuiIconButton-label > svg {
                fill: ${tokens.colors.interactive.disabled__border.rgba};
            }


        .MuiCheckbox-colorSecondary.Mui-checked:hover {
            background-color:  ${tokens.colors.interactive.primary__hover_alt.rgba};
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
`;

export const Divider = styled.div`
    margin-top: calc(var(--grid-unit) * -3);
    margin-bottom: -1000px;
    margin-right: calc(var(--grid-unit) * 2);
    margin-left: calc(var(--grid-unit) * 5);
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;

export const Header = styled.header`
    display: flex;
    align-items: center;

    #backButton {
        margin-right: var(--grid-unit);
    }

    h1 {
        margin-right: calc(var(--grid-unit) * 2);
    };
`;

export const Search = styled.div`
    display: flex;
    flex: 1;
    padding-bottom: calc(var(--grid-unit) * 3);
    input {
        width: 500px;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-self: flex-start;
    justify-content: flex-end;

    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

export const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: calc(var(--grid-unit) * 3) 0;
    align-items: center;
`;

export const TagsHeader = styled.div`
    font-weight: bold;
`;

export const LoadingContainer = styled.div`
    background-color: ${tokens.colors.ui.background__default.rgba};
    height: 100%;

    h1 {
        font-size: calc(var(--grid-unit) * 3);
    }
`;
