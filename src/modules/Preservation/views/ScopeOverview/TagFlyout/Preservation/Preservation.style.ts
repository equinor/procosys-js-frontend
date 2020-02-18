import styled, { css } from 'styled-components';
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

export const Details = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: calc(var(--grid-unit) * 2);
`;

export const RequirementContainer = styled.div`
    width: 100%;
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
    padding: 
        calc(var(--grid-unit) * 4) 
        calc(var(--grid-unit) * 2) 
        calc(var(--grid-unit) * 2) 
        calc(var(--grid-unit) * 2);
`;

export const RequirementSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 95%;
    margin-bottom: calc(var(--grid-unit) * 2);
`;

export const Field = styled.div`
    margin-bottom: var(--grid-unit);
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

export const NextInfo = styled.span<{ isOverdue: boolean }>`
    ${(props): any => props.isOverdue && css`
        color: ${tokens.colors.interactive.danger__text.rgba};
    `}
`;