import styled from 'styled-components';

export const Container = styled.div`
    margin: var(--margin-module--top) var(--margin-module--right);
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
    
        margin-left: calc(var(--margin-module--right) * -1);
        margin-right: calc(var(--margin-module--right) * -1);
    }
`;

export const InvitationContentContainer = styled.div`
    width: 100%;
    position: relative;
`;

interface CommentsProps {
    commentsDisplayed: boolean;
}

export const CommentsContainer = styled.div<CommentsProps>`
    display: ${(props: any): string => props.commentsDisplayed ? 'block' : 'none'}
`;


export const CommentsIconContainer = styled.div`
    position: absolute;
    top: var(--margin-module--top);
    right: var(--margin-module--right);
    margin-right: 20px;
`;

export const CenterContainer = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    margin-top: 10%;
`;

export const InvitationContainer = styled.div`
    display: flex;
    height: 100%;
`;
