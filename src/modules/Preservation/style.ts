import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    margin: calc(var(--grid-unit) * 2) var(--margin-module--right);
    display: flex;
    height: 100%;
    flex-direction: column;
    h1 {
        font-size: 36px;
    }
`;

export const OldPreservationLink = styled.div`
    display: flex;
    padding-bottom: var(--grid-unit);
    justify-content: flex-end;
    color: ${tokens.colors.interactive.primary__resting.rgba};
    text-decoration: underline;
    cursor: pointer;
`;
