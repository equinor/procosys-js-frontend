import styled from 'styled-components';

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
