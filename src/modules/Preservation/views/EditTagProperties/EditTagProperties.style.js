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
    margin: calc(var(--grid-unit) * 2) 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    margin-top: calc(var(--grid-unit) * 3);
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

export const SpinnerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    position: fixed;
    margin-bottom: 36px;
`;

export const ErrorContainer = styled.div`
    p {
        min-height: 1rem;
        height: calc(var(--grid-unit) * 2);
        color: ${tokens.colors.interactive.danger__text.rgba};
    }    
`;
