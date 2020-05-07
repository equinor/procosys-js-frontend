import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
`;

export const AddFile = styled.div`
    display: flex;    
    background: red;
    align-items: center;
    cursor: pointer;
    justify-content: flex-end;
    padding-top: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
    
    form {
        background:yellow;
        cursor: pointer;
    }    
    label {
        background:green;
        cursor: pointer;
    }    
`;

export const AttachmentLink = styled.div`

display: flex;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: underline;
    cursor: pointer;
`;
