import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    overflow: hidden;
    overflow-y: scroll;
    padding-top: var(--margin-module--top);
    padding-right: calc(var(--grid-unit) * 5);
    padding-left: calc(var(--grid-unit) * 5);
    width: 20vw;
`;
