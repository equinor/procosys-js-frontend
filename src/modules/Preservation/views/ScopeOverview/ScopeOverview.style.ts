import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
`;

export const Header = styled.header`
    display: flex;

    h1 {
        display: inline-block;
        margin-right: calc(var(--grid-unit) * 2);
    }

    div {
        display: flex;
    }

    a {
        text-decoration: none;
    }
`;

export const IconBar = styled.div`
    display: flex;
`;
