import { tokens } from '@equinor/eds-tokens';
import styled from 'styled-components';

export const MainContainer = styled.div`
    height: 70vh;
`;

export const TableContainer = styled.div<{ isHalfSize: boolean }>`
    height: ${(props): string => (props.isHalfSize ? '50%' : '100%')};
`;

export const ButtonSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
`;

export const Content = styled.div`
    padding-right: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 2);
`;

export const DialogContainer = styled.div<{ width: string }>`
    ${(props): any => `
        display: block;
        max-height: 90%;
        height: 80%;
        overflow: auto;
        width: ${props.width};
        background-color: ${tokens.colors.ui.background__default.rgba};       
        box-shadow: ${tokens.elevation.above_scrim}; 
        border-radius: ${tokens.shape.corners.borderRadius}; 
       `}
`;

export const Divider = styled.div`
    border-top: 1px solid ${tokens.colors.interactive.disabled__border.rgba};
    box-sizing: border-box;
    margin-top: var(--grid-unit);
    padding-bottom: var(--grid-unit);
`;

export const Scrim = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: ${tokens.colors.ui.background__scrim.rgba};
    z-index: 100;
`;

export const Title = styled.div`
    padding-top: calc(var(--grid-unit) * 2 - 4px);
    padding-right: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
`;
