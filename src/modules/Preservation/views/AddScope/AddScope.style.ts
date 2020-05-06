import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
`;

export const TagProperties = styled.div`
    width: 70%;
`;

export const SelectedTags = styled.div`
    width: 30%;
    margin-left: var(--grid-unit);
    margin-bottom: calc(var(--grid-unit) * 4);
`;

export const Divider = styled.div`
    margin-top: calc(var(--margin-module--top) * -1);
    margin-bottom: -1000px;
    margin-right: calc(var(--grid-unit) * 2);
    margin-left: calc(var(--grid-unit) * 5);
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;
