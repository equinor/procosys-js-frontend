import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
`;

export const Divider = styled.div`
    margin-top: calc(var(--margin-module--top) * -1);
    margin-bottom: -1000px;
    margin-left: calc(var(--grid-unit) * 5);
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;
