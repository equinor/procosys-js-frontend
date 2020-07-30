import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Overlay = styled.div`
    display: flex;
    position: absolute;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 200;
`;

export const Container = styled.div`
    background: ${tokens.colors.ui.background__default.rgba};
    box-shadow: ${tokens.elevation.raised};
    max-height: 90%;
    width: 90%;
    margin: calc(var(--grid-unit) * 2) auto;
    border-radius: 4px;
    overflow-x: hidden;
    overflow-y: auto;
`;

export const Details = styled.div`
    padding: calc(var(--grid-unit) * 2);
`;
