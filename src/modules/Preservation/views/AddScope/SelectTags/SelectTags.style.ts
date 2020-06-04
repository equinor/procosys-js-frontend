import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
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
    margin-top: calc(var(--grid-unit) * 3);
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

export const Toolbar = styled.div`
    font-size: calc(var(--grid-unit) * 2);
    line-height: calc(var(--grid-unit) * 3);
    margin-top: calc(var(--grid-unit) * 2);
    margin-bottom: var(--grid-unit);
    color: ${tokens.colors.text.static_icons__secondary.rgba};
`;
