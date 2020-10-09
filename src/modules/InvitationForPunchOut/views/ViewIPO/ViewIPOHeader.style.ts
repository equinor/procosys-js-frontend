import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: ${tokens.colors.ui.background__light.rgba};
    margin: calc(var(--margin-module--top) * -1) calc(var(--margin-module--right) * -1) 0 calc(var(--margin-module--right) * -1);
    padding: calc(var(--grid-unit) * 2) var(--margin-module--right) calc(var(--grid-unit) * 4) var(--margin-module--right);
`;

export const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: calc(var(--grid-unit) * 3);
`;
