import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    h1 {
        margin-right: calc(var(--grid-unit) * 2);
    };
`;

export const InputContainer = styled.div`
    display: grid;
    margin-bottom: calc(var(--grid-unit) *2);
    grid-template-columns: 3fr 1fr 1fr;
    max-width: 50vw;
`;

export const FormFieldSpacer = styled.div`
    margin-left: calc(var(--grid-unit) * 2);
    .voidUnvoid svg {
        padding-right: var(--grid-unit);
    }
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

export const ActionContainer = styled.div`
    max-width: 300px;
`;
