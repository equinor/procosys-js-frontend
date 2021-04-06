import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const InputContainer = styled.div`
    margin:  calc(var(--grid-unit) * 2) 0px;
    display: flex;
`;

export const FormFieldSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
    align-self: flex-start;
    #dropdownIcon {
        height: calc(var(--grid-unit) * 3);
    }
`;

export const Scrim = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: ${tokens.colors.ui.background__scrim.rgba};
    z-index:100; 
`;

export const DialogContainer = styled.div<{ width: string }>`
    ${(props): any => `
        display: block;
        max-height: 90%;
        overflow: auto;
        width: ${props.width};
        background-color: ${tokens.colors.ui.background__default.rgba};       
        box-shadow: ${tokens.elevation.above_scrim}; 
        border-radius: ${tokens.shape.corners.borderRadius}; 
       `}
`;

export const Title = styled.div`
    padding-top: calc( var(--grid-unit) * 2 - 4px );
    padding-right: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
`;

export const Divider = styled.div`
    border-top: 1px solid ${tokens.colors.interactive.disabled__border.rgba};      
    box-sizing: border-box;
    margin-top: var(--grid-unit);
    padding-bottom: var(--grid-unit);
`;

export const Content = styled.div`
    padding-right: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 2);
`;

export const ButtonContainer = styled.div`
    display:flex;
    justify-content: flex-end;
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
`;

export const ButtonSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;
