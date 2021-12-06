import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: calc(var(--grid-unit) * 2);
`;

export const Field = styled.div`
    margin-bottom: var(--grid-unit);
`;

export const AttachmentLink = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: underline;
    cursor: pointer;
    color: ${tokens.colors.interactive.primary__resting.rgba};
    margin-bottom: var(--grid-unit);
`;
