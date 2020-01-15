import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Header = styled.header`
    h1 {
        display: inline-block;
        margin-right: calc(var(--grid-unit) * 2);
    };

    div {
        margin-right: var(--grid-unit);
    }

    a {
        text-decoration: none;
    }
`;
