import styled from 'styled-components';

export const ButtonSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;

export const FormFieldSpacer = styled.div`
    display: flex;
    margin-right: calc(var(--grid-unit) * 2);
    padding-bottom: var(--grid-unit);
`;

export const InputContainer = styled.div`
    margin: var(--grid-unit) 0px;
    display: flex;
    flex-direction: row;
    padding-left: var(--grid-unit);
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

export const FormHeader = styled.div`
    margin: calc(var(--grid-unit) * 3) 0px 0px var(--grid-unit);
    font-weight: bold;
`;

export const FieldsContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    width: fit-content;
    padding: var(--grid-unit);
    align-items: flex-end;
`;
