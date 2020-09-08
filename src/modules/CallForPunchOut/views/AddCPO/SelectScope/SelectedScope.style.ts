import styled from 'styled-components';

export const SelectedScopeContainer = styled.div`
    margin-left: var(--grid-unit);
    margin-bottom: calc(var(--grid-unit) * 4);
    width: 30%;

    > p {
        margin: calc(var(--grid-unit) * 2) 0;
    }
`;

export const AccordionContent = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    > div {
        display: inline-block;
    }

    > div:first-child {
        width: 100%;
        margin-bottom: calc(var(--grid-unit) * 2);
    }

    > div:not(:first-child) {
        flex: 1;
    }
`;
