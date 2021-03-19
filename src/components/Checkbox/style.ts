import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

interface CheckboxStyleProps {
    disabled: boolean;
    checked?: boolean;
}

export const Container = styled.label<CheckboxStyleProps>`
    /* The container */
    display: flex;
    align-items: center;
    
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
        :hover input ~ .checkmarkWrapper {
            background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba};
        }
    `}
`;


export const CheckmarkWrapper = styled.span<CheckboxStyleProps>`
    /* Create the hover state for the checkbox */
    border-radius: 50%;
    background-color: ${tokens.colors.ui.background__default.rgba};
    height: calc(var(--grid-unit) * 6);
    width: calc(var(--grid-unit) * 6);

    /* Position checkbox inside the circle */
    display: flex;
    align-items: center;
    justify-content: center;
`;