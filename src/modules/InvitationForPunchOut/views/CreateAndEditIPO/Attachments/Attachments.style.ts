import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    width: 100%;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    > * {
        margin-bottom: calc(var(--grid-unit) * 3);
    }
`;