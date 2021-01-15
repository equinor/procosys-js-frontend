import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    
    .tabs {
        width: 100%;
        min-width: 300px;
        overflow-x: auto;
        div:first-child {
            grid-template-columns: auto auto auto auto 1fr;
        }
        .emptyTab {
            pointer-events: none;
        }
    }
`;

interface CommentsProps {
    commentsDisplayed: boolean;
    maxHeight: number;
}

export const CommentsContainer = styled.div<CommentsProps>`
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
    height: ${(props): number => props.maxHeight}px; 
    width: 400px;
    min-width: 300px;
    display: ${(props: any): string => props.commentsDisplayed ? 'block' : 'none'};
    background: var(--ui-background--default);
`;


export const CommentsIconContainer = styled.div`
    position: absolute;
    top: var(--margin-module--top);
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
    overflow: auto;
`;

export const InvitationContentContainer = styled.div`
    display: flex;
    position: relative;
`;
