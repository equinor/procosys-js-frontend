import styled, { css } from 'styled-components';

interface StyledButtonProps {
    primary?: boolean;
    disabled?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
    border-radius: 4px;
    border: 0px;
    font-weight: 500;
    font-size: 14px;
    padding: 10px 16px 10px 16px;
    
    ${(props): any => props.primary && css`
        background: var(--interactive-primary--resting);
        color: var(--text--primary-white);
        cursor: pointer;
    `}

    ${(props): any => props.disabled && css`
        color: #6F6F6F;
        cursor: not-allowed;
    `}
`;