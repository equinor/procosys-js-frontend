import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

interface CheckboxStyleProps {
    disabled: boolean;
}

export const Container = styled.label<CheckboxStyleProps>`
    /* The container */
    display: block;
    position: relative;
    padding-left: calc(var(--grid-unit) * 4);
    
    cursor: ${(props): string => props.disabled ? 'not-allowed' : 'pointer'};

    /* Hide the browser's default checkbox */
    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* On mouse-over, add a background color */
    ${(props): any => !props.disabled && css`
        :hover input ~ .checkmark {
            background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba};
        }
    `}

    /* When the checkbox is checked, add a fill background */
    input:checked ~ .checkmark {
        background-color: ${tokens.colors.interactive.primary__resting.rgba};
    }

    /* Show the checkmark when checked */
    input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .checkmark:after {
        left: 4px;
        top: 0px;
        width: 6px;
        height: 11px;
        border: solid ${tokens.colors.ui.background__default.rgba};
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(40deg);
        -ms-transform: rotate(40deg);
        transform: rotate(40deg);
    }
`;

export const Checkmark = styled.span<CheckboxStyleProps>`
    /* Create a custom checkbox */
    position: absolute;
    top: 0;
    left: 0;
    height: calc(var(--grid-unit) * 2);
    width: calc(var(--grid-unit) * 2);
    background-color: ${tokens.colors.ui.background__default.rgba};
    border-radius: 3px;

    border: solid 2px ${(props): string => props.disabled
        ? tokens.colors.interactive.disabled__fill.rgba
        : tokens.colors.interactive.primary__resting.rgba};

    /* Create the checkmark/indicator (hidden when not checked) */
    :after {
        content: "";
        position: absolute;
        display: none;
    }
`;