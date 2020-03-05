import { tokens } from '@equinor/eds-tokens';
import styled from 'styled-components';

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

export const DialogContainer = styled.div<{ width: number }>`
    ${(props): any => `
        display: block;
        width: ${props.width}px;
        background-color: white;
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12),
        0px 6px 10px rgba(0, 0, 0, 0.14);
        border-radius: 4px;
       `}
`;

export const Title = styled.div`
    padding-top: calc( var(--grid-unit) * 2 - 4px );
    padding-right: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
`;

export const Divider = styled.div`
    border-top: 1px solid #DCDCDC;
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
    float: right;
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
`;
