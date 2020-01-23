import styled from 'styled-components';

export const InputContainer = styled.div`
    margin: calc(var(--grid-unit) * 2) 0px;
`;

export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
`;

export const ButtonContainer = styled.div`
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;
