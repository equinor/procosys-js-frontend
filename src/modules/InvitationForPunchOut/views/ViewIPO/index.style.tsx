import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    width: 100%;

    .tabs {
        width: 100%;
        min-width: 300px;
        overflow-x: auto;
        >div:first-child {
            grid-template-columns: auto auto auto auto 1fr;
        }
        .emptyTab {
            pointer-events: none;
        }
    }
`;

export const CommentsContainer = styled.div<{ maxHeight: number }>`
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
    height: ${(props): number => props.maxHeight}px;
    width: 400px;
    min-width: 300px;
    background: var(--ui-background--default);
    overflow-y: scroll;
`;


export const CommentsIconContainer = styled.div`
    position: absolute;
    top: 5px;
    right: var(--margin-module--right);
`;

export const CenterContainer = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    margin-top: 10%;
`;

export const InvitationContainer = styled.div`
    width: 100%;
`;

export const TabsContainer = styled.div`
    width: 100%;
    overflow-x: hidden;
`;

export const TabStyle = styled.div<{ maxHeight: number }>`
    height: ${(props): number => props.maxHeight}px;
    overflow: scroll;
`;

export const InvitationContentContainer = styled.div`
    display: flex;
    position: relative;
    width: 100%;
`;
