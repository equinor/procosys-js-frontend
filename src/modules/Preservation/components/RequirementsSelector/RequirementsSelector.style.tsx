import SelectInput from '@procosys/components/Select';
import styled from 'styled-components';

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    h1 {
        margin-right: calc(var(--grid-unit) * 2);
    }
`;

export const InputContainer = styled.div`
    display: flex;
    margin-bottom: calc(var(--grid-unit) * 2);
`;

export const FormFieldSpacer = styled.div`
    margin-left: calc(var(--grid-unit) * 2);
    .voidUnvoidDelete svg {
        padding-right: var(--grid-unit);
    }
`;

export const ActionContainer = styled.div`
    max-width: 300px;
`;

export const ButtonContainer = styled.div`
    display: flex;
`;

export const RequirementSelectorContainer = styled.div`
    max-width: 30vw;
    min-width: 30vw;
`;

export const IntervalSelectorContainer = styled.div`
    max-width: 10vw;
    min-width: 10vw;
`;
