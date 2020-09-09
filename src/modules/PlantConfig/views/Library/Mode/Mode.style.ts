import styled from 'styled-components';

export const ButtonSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;

export const InputContainer = styled.div`
    margin: var(--grid-unit) 0px;
    display: flex;
    flex-direction: row;
    padding: var(--grid-unit);
`;

export const Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column; 
    padding: var(--grid-unit);
`;

export const StepsContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto; 
    width: fit-content;
    padding: var(--grid-unit);
    align-items:flex-end;
`;

export const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;

export const IconContainer = styled.div`
    display: flex;
`;

export const Breadcrumbs = styled.section`
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--grid-unit);
`;
