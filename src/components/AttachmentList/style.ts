import styled from 'styled-components';

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
    padding-top: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
    
    label {
        display:flex;
        align-items: center;
        cursor: pointer;
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


