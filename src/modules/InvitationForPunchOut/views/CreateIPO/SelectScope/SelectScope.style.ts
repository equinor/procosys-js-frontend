import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
`;

export const SelectComponent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 2;
`;

export const Header = styled.header`
    display: flex;
    align-items: center;
    h2 {
        line-height: calc(var(--grid-unit) * 6);
    }
    #backButton {
        margin-right: var(--grid-unit);
    }
`;

export const Divider = styled.div`
    margin-top: calc(var(--grid-unit) * -3);
    margin-bottom: -1000px;
    margin-right: calc(var(--grid-unit) * 2);
    margin-left: calc(var(--grid-unit) * 5);
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;
