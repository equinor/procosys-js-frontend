import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

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
    margin-top: calc(var(--grid-unit) * 3);
`;


export const InputContainer = styled.div`
    margin:  calc(var(--grid-unit) * 2) 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const Next = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    margin-right: calc(var(--grid-unit));
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

export const FormFieldSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;

export const ButtonContent = styled.span`
    display: flex;
    align-items: center;
    color: ${tokens.colors.interactive.primary__resting.rgba};
    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
    svg {
        margin-right: var(--grid-unit);
    }
`;

export const CenterContent = styled.span`
    display: flex;
    align-items: center;
`;
