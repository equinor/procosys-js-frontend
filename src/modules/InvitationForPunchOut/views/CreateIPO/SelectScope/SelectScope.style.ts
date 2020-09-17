import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
`;

export const SelectComponent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 2;
`;

export const Header = styled.header`
    display: flex;
    align-items: center;
    h2 {
        line-height: calc(var(--grid-unit) * 6);
    }
    #backButton {
        margin-right: var(--grid-unit);
    }
`;

export const Search = styled.div`
    display: flex;
    flex: 1;
    padding-bottom: calc(var(--grid-unit) * 3);
    input {
        max-width: 500px;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-self: flex-start;
    justify-content: flex-end;

    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

export const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: calc(var(--grid-unit) * 3) 0;
    align-items: center;
`;
