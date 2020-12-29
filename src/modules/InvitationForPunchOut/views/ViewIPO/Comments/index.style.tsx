import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    position: relative;
    display: block;
    right: 0;
    max-width: 20%;
    min-width: 200px;
    min-height: 100%;
    margin: 0 var(--margin-module--right);
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 2);
    border-left: 1px solid ${tokens.colors.interactive.disabled__border.rgba};
`;

export const HeaderContainer = styled.div`
`;

export const CommentSectionContainer = styled.div`
    position: relative;
`;

export const CommentContainer = styled.div`
    position: relative;
    margin: calc(var(--grid-unit) * 6) 0;
    line-height: calc(var(--grid-unit) * 3);
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
    background: rgba(0, 0, 0, 0.01);
    z-index: 9999;
    align-items: center;
    justify-content: center;
`;
