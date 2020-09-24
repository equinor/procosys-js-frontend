import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    width: 100%;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;
