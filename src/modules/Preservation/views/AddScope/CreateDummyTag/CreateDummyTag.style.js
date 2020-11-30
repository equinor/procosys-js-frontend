import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { TextField } from '@equinor/eds-core-react';

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    h1 {
        margin-right: calc(var(--grid-unit) * 2);
    };
`;

export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
`;

export const TopContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: calc(var(--grid-unit));

    p {
        display: block;
        height: calc(var(--grid-unit) * 2);
        color: ${tokens.colors.interactive.danger__text.rgba};
    }
`;

export const InputContainer = styled.div`
    margin:  calc(var(--grid-unit) * 2) 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const SuffixTextField = styled(TextField)`
    max-width: 200px;
`;

export const ButtonsContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }

    p {
        padding-top: var(--grid-unit);
        color: ${tokens.colors.interactive.danger__text.rgba};
    }
`;

export const FormFieldSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
    align-self: flex-end;
    #dropdownIcon {
        height: calc(var(--grid-unit) * 3);
    }
`;

export const CenterContent = styled.span`
    display: flex;
    align-items: center;
`;

export const DropdownItem = styled.div`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba}
    }
`;

export const ErrorContainer = styled.div`
    min-height: 1rem;
`;

