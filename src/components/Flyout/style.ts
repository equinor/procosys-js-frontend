import styled from 'styled-components';
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

export const FlyoutContainer = styled.div`
    background: ${tokens.colors.ui.background__default.rgba};
    position: fixed;
    right: 0;
    top: 0;
    width: 30%;
    height: 100%;

    opacity: 0;
    transition: opacity 0.5s;
`;