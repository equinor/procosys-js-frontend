import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';


export const Container = styled.div`
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
    padding: calc(var(--grid-unit) * 2);
    padding-top: 0px;
    padding-right: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
`;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: calc(var(--grid-unit) * 2);
    font-weight: normal;
`;

export const GridRow = styled.div`
    display: grid;
    grid-template-columns: calc(var(--grid-unit) * 10) auto auto auto;
    grid-template-rows: auto auto;
    grid-column-gap: calc(var(--grid-unit) * 3);
    float: left;
`;