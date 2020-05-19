import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
`;

export const AddFile = styled.div`
    display: flex;    
    align-items: center;
    justify-content: flex-end;
    padding: calc(var(--grid-unit) * 2);
    svg {
        padding-bottom: 4px;
    }
   
    label {
        display:flex;
        align-items: center;
        cursor: pointer;
        color:${tokens.colors.interactive.primary__resting.rgba};
    }    
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


