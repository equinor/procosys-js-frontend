import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const AddFile = styled.div`
    display: flex;    
    align-items: center;
    justify-content: flex-end;
    padding: calc(var(--grid-unit) * 2);
`;

export const FormFieldSpacer = styled.div`
    margin-right: var(--grid-unit);
`;

export const AttachmentLink = styled.div`
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: underline;
    cursor: pointer;
`;

export const StyledButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: var(--grid-unit);

    :hover {
        background: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;

