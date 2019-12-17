import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Header = styled.header`
    flex-direction: row;
    h1 {
        display: inline-block;
        margin-right: calc(var(--grid-unit) * 2);
    };

`;
