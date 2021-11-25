import styled from 'styled-components';

export const Container = styled.div`
    margin: calc(var(--grid-unit) * 2);
    display: flex;
    flex-direction: row;
`;

export const LeftSection = styled.section`
    display: flex;
    flex: 2;
    flex-direction: column;
`;

export const RightSection = styled.section`
    display: flex;
    flex-direction: row;
`;

export const ActionContainer = styled.div`
    display: flex;
    flex-direction: row;
    button {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;
