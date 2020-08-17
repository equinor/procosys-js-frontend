import styled from 'styled-components';

export const ButtonSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;

export const FormFieldSpacer = styled.div`
    display: flex;
    margin-right: calc(var(--grid-unit) * 2);
    padding-bottom: var(--grid-unit);
    .voidUnvoid svg {
        padding-right: var(--grid-unit);
    }
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

export const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    .buttonIcon svg {
        padding-right: var(--grid-unit);
    }
`;

export const IconContainer = styled.div`
    display: flex;
`;

export const SelectText = styled.div`
    display: flex;
    align-items: center;

    svg:first-of-type {
        padding-right: calc(var(--grid-unit) * 2);
    }
`;

export const Breadcrumbs = styled.section`
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--grid-unit);
`;
