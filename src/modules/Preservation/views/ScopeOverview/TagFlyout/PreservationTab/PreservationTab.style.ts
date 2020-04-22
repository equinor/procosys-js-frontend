import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TagDetailsContainer = styled.div`
    display: flex;
    background: ${tokens.colors.ui.background__light.rgba};
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
`;

export const Details = styled.div`
    display: flex;
    flex-direction: column;
    padding: calc(var(--grid-unit) * 2);
`;

export const TagDetailsInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: calc(var(--grid-unit) * 2);
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
`;

export const GridFirstRow = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    grid-column-gap: calc(var(--grid-unit) * 3);
    float: left;
`;

export const GridSecondRow = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-template-rows: auto auto;
    grid-column-gap: calc(var(--grid-unit) * 3);
    float: left;
`;
