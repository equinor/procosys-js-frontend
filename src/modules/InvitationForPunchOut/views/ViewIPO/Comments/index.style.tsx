import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    position: fixed;
    right: 0;
    width: 400px;
    max-width: 80%;
    height: 100%;
    max-height: calc(100vh - 300px);
    border-left: 1px solid ${tokens.colors.interactive.disabled__border.rgba};
    background: var(--ui-background--default);
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: calc(var(--grid-unit) * 2);
`;

export const CommentSectionContainer = styled.div`
    position: relative;
    width: 100%;
    height: 60%;
    overflow-y: scroll;
`;

export const CommentContainer = styled.div`
    position: relative;
    margin: calc(var(--grid-unit) * 6) 0;
    line-height: calc(var(--grid-unit) * 3);
    padding: 0 calc(var(--grid-unit) * 2);
`;

export const CommentHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--grid-unit);
`;

export const SpinnerContainer = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    align-items: center;
    justify-content: center;
`;
