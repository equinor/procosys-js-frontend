import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    margin: var(--margin-module--top) var(--margin-module--right);
    position: relative;

    .tabs {
        div:first-child {
            grid-template-columns: auto auto auto auto 1fr;
        }
        .emptyTab {
            pointer-events: none;
        }
    
        margin-left: calc(var(--margin-module--left) * -1);
        margin-right: calc(var(--margin-module--right) * -1);
    }
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    > * {
        margin-bottom: calc(var(--grid-unit) * 3);
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
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

export const SpinnerContainer = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.01);
    z-index: 9999;
    align-items: center;
    justify-content: center;
`;

export const AttachmentTable = styled.table`
    width: 95%;
`;
