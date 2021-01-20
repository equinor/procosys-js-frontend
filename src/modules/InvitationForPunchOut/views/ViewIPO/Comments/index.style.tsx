import { Button } from '@equinor/eds-core-react';
import styled from 'styled-components';

export const Container = styled.div`
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: calc(var(--grid-unit) * 2);
`;


export const CommentContainer = styled.div`
    position: relative;
    margin: calc(var(--grid-unit) * 6) 0;
    line-height: calc(var(--grid-unit) * 3);
    padding: 0 calc(var(--grid-unit) * 2);
    word-wrap: break-word;
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

export const AddSectionContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin: var(--margin-module--top) 0;
    padding: 0 calc(var(--grid-unit) * 2);
`;

export const StyledButton = styled(Button)`
    margin-top: var(--grid-unit);
    margin-left: auto !important;
`;
