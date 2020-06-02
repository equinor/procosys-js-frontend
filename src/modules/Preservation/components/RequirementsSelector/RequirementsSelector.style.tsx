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
    display: flex;
    margin-bottom: calc(var(--grid-unit) *2);
    flex-direction: row;
    align-items: center;
`;

export const FormFieldSpacer = styled.div`
    margin-left: calc(var(--grid-unit) * 2);
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
