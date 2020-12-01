import styled, { FlattenSimpleInterpolation, css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Overlay = styled.div`
    background: ${tokens.colors.ui.background__scrim.rgba};
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    
    z-index: 100;
`;

export const FlyoutContainer = styled.div<{ position: string, minWidth: string, maxWidth: string }>`
    background: ${tokens.colors.ui.background__default.rgba};
    position: fixed;
       
    ${({ position }): FlattenSimpleInterpolation => {
        if (position && position == 'left') {
            return css`
                left: 0;
            `;
        } else {
            return css`
                right: 0;
            `;
        }
    }};
 
    top: 0;
    min-width: ${(props): string => props.minWidth};
    max-width: ${(props): string => props.maxWidth};
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    opacity: 0;
    transition: opacity 0.5s;
`;