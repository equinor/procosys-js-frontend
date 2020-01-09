import styled, { css } from 'styled-components';

interface StyledButtonProps {
    primary?: boolean;
    disabled?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
    border-radius: 4px;
    border: 0px;
    height: 36px;
    
    ${(props): any => props.primary && css`
        background: var(--interactive-primary--resting);
        cursor: pointer;
    `}

    ${(props): any => props.disabled && css`
        cursor: not-allowed;
    `}
`;

export const StyledButtonLabel = styled.label<StyledButtonProps>`
    display: flex;
    align-items: center;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    height: 16px;
    padding-left: 16px;
    padding-right: 16px;

    ${(props): any => props.primary && css`
        color: var(--text--primary-white);
        cursor: pointer;
    `}

    ${(props): any => props.disabled && css`
        color: #6F6F6F;
        cursor: not-allowed;
    `}
`;