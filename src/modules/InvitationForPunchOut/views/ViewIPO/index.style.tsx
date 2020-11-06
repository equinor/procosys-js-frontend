import styled from 'styled-components';

export const Container = styled.div`
    margin: var(--margin-module--top) var(--margin-module--right);
    width: 100%;
    
    .tabs {
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

export const CenterContainer = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    margin-top: 10%;
`;
