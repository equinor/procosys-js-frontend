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
