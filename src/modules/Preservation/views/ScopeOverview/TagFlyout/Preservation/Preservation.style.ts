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
    width: 100%;
`;

export const TagDetails = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: calc(var(--grid-unit) * 4) calc(var(--grid-unit) * 2);
`;

export const RemarkContainer = styled.div`
    width: 100%;
    padding: calc(var(--grid-unit) * 2);
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};

    input {
        width: 95%;
    }
`;

export const GridFirstRow = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    grid-gap: var(--grid-unit);
`;

export const GridSecondRow = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-template-rows: auto auto;
    grid-gap: var(--grid-unit);
`;