import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const SelectedScopeContainer = styled.div`
    flex: 1;
    margin-top: calc(var(--grid-unit) * -3);
    padding-top: calc(var(--grid-unit) * 3);
    padding-left: calc(var(--grid-unit) * 2);
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

export const TextContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;

    > p {
        margin: calc(var(--grid-unit) * 2) 0;
    }

    > div {
        display: flex;
        align-items: center;
        color: ${tokens.colors.interactive.warning__resting.rgba};
        svg {
            margin-right: var(--grid-unit);
        }
        p {
            color: ${tokens.colors.interactive.warning__resting.rgba};
        }
    }
`;
