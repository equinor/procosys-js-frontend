import styled from 'styled-components';

export const Toolbar = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
    margin-bottom: var(--grid-unit);
`;

export const Container = styled.div`
    div > div > div > div[style] {
        overflow-y: hidden !important; /* This is to remove the scrollbar in table that makes it seem like the page is lagging when user is scrolling  */
    }
`;
