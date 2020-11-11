import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    margin: var(--margin-module--top) var(--margin-module--right);
`;

export const HeaderContainer = styled.div`
    height: calc(var(--grid-unit) * 4);
`;

export const TableContainer = styled.div`
    margin: var(--grid-unit) var(--grid-unit) calc(var(--grid-unit) * 4) 0;
    min-width: 600px;
`;
