import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    overflow-x: scroll;
    flex-direction: column;
    input + svg {
        width: 24px;
        height: 24px;
    }
`;

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    h1 {
        margin-right: calc(var(--grid-unit) * 2);
    };
`;

export const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Search = styled.div`
    display: flex;
    flex: 1;
    padding-bottom: calc(var(--grid-unit) * 3);
    input {
        width: 500px;
    }
`;

export const ButtonSeparator = styled.div`
     margin-left: calc(var(--grid-unit) * 2);
`;


export const ButtonsContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-self: flex-start;
    justify-content: flex-end;
`;

export const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: calc(var(--grid-unit) * 3) 0;
    align-items: center;
`;

export const TagsHeader = styled.div`
    font-weight: bold;
`;

export const LoadingContainer = styled.div`
    background-color: ${tokens.colors.ui.background__default.rgba};
    height: 100%;

    h1 {
        font-size: calc(var(--grid-unit) * 3);
    }
`;

