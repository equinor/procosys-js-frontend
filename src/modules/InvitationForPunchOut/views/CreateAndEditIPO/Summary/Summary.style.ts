import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 100%;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    .timeContainer {
        display: flex;
        > div {
            margin-right: calc(var(--grid-unit) * 2);
        }
    }
    margin-bottom: calc(var(--grid-unit) * 4);
`;

export const Subsection = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: var(--grid-unit);
    margin-top: calc(var(--grid-unit) * 2);
    p:first-child {
        margin-bottom: var(--grid-unit);
    }
`;

export const TableSection = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
    margin-bottom: calc(var(--grid-unit) * 4);
    h5 {
        margin-bottom: calc(var(--grid-unit) * 2);
    }
    th, td {
        vertical-align: middle;
    }
`;
