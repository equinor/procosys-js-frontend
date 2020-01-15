import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    margin: 50px 35px;
    display: flex;
    height: 100%;
    flex-direction: column;
    h1 {
        font-size: 36px;
    }
`;

export const Button = styled.button`
    font-family: Equinor;
    font-style: normal;
    color: var(--text--primary-white);
    font-size: 14px;
    padding: 10px 16px;
    border-radius: 4px;
    border: none;
    background-color: ${tokens.colors.interactive.primary__resting.rgba};
    font-weight: 500;
`;
