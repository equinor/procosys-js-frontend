import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const ButtonSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;

export const FormFieldSpacer = styled.div`
    display: flex;
    margin-right: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 2);
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
    .buttonIcon svg {
        padding-right: var(--grid-unit);
    }
`;

export const IconContainer = styled.div`
    display: flex;
`;

export const DropdownItem = styled.div`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba}
    }
`;

export const ResponsibleDropdownContainer = styled.div`
    width: 100%;
    > div {
        width: 100%;
    }
`;
