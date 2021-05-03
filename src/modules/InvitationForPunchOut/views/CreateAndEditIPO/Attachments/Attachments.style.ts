import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    width: 100%;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    > * {
        margin-bottom: calc(var(--grid-unit) * 3);
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

export const AddAttachmentContainer = styled.div`
    max-width: 300px;
`;

export const DragAndDropContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 500px;
    height: 200px;
    background-color: ${tokens.colors.ui.background__light.rgba};
`;

export const OverflowColumn = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const AttachmentsTableContainer = styled.div`
    height: 35vh;
`;
