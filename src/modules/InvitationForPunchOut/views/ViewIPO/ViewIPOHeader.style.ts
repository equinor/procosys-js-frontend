import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: ${tokens.colors.ui.background__light.rgba};
    padding: calc(var(--grid-unit) * 2) 0 calc(var(--grid-unit) * 4) 0;
`;

export const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content:space-between;
    margin: 0 var(--margin-module--right) calc(var(--grid-unit) * 3) var(--margin-module--right);
`;

export const ProgressBarContainer = styled.div`
    margin: 0 var(--margin-module--right);
`;

export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const ButtonSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;
